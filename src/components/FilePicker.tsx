// FilePicker.ts
import { Alert, Platform } from 'react-native';
import {
    launchCamera,
    ImagePickerResponse,
    MediaType,
    CameraOptions,
} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

export interface FilePickerResult {
    uri: string;        // app-private/cache URI
    fileName?: string;
    fileSize?: number;
    type?: string;
}

const APP_CACHE_DIR =
    Platform.OS === 'ios' ? RNFS.CachesDirectoryPath : RNFS.CachesDirectoryPath;

// Generate a safe local path inside app cache
function cachePath(name: string) {
    const safe = name.replace(/[^\w.\-]/g, '_');
    return `${APP_CACHE_DIR}/${Date.now()}_${safe}`;
}

// Copy any content:// or file:// to app cache and return the new file:// URI
async function ensureInCache(srcUri: string, preferredName = 'file.bin'): Promise<string> {
    try {
        const dest = cachePath(preferredName);
        // RNFS supports both file:// and content:// on Android for copyFile
        await RNFS.copyFile(srcUri, dest);
        return `file://${dest}`;
    } catch (e) {
        // Fallback: if copy fails but src is already file://, just return it
        if (srcUri.startsWith('file://')) return srcUri;
        throw e;
    }
}

/**
 * Pick a document (PDF/images/docs/etc.) WITHOUT touching gallery.
 * Lands in app cache via SAF (Android) / Files (iOS).
 */
export async function pickDocument(): Promise<FilePickerResult | null> {
    try {
        const file = await DocumentPicker.pickSingle({
            type: DocumentPicker.types.allFiles, // or restrict list if you want
            copyTo: 'cachesDirectory',           // key: gives you fileCopyUri in app cache
        });

        const uri = file.fileCopyUri || file.uri;
        if (!uri) return null;

        // On some OEMs, fileCopyUri can be missing; ensure we cache it ourselves
        const finalUri = file.fileCopyUri
            ? file.fileCopyUri
            : await ensureInCache(uri, file.name ?? 'document.bin');

        return {
            uri: finalUri,
            fileName: file.name,
            fileSize: file.size,
            type: file.type,
        };
    } catch (err: any) {
        if (DocumentPicker.isCancel?.(err)) return null;
        if (DocumentPicker.isInProgress?.(err)) return null;
        console.error('pickDocument error:', err);
        Alert.alert('Error', 'Failed to pick document.');
        return null;
    }
}

/**
 * Take a photo WITHOUT saving to Photos/Gallery.
 * We explicitly set saveToPhotos: false, then copy to app cache.
 */
export async function takePrivatePhoto(
    opts: Partial<CameraOptions & { mediaType?: MediaType }> = {}
): Promise<FilePickerResult | null> {
    const options: CameraOptions = {
        mediaType: (opts.mediaType as MediaType) || 'photo',
        includeBase64: false,
        saveToPhotos: false,   // <- important: do not save to gallery
        quality: 0.8,
        ...opts,
    };

    try {
        const response: ImagePickerResponse = await new Promise((resolve, reject) => {
            launchCamera(options, (res) => {
                if (res.errorCode) reject(new Error(res.errorMessage || 'Camera error'));
                else resolve(res);
            });
        });

        if (response.didCancel) return null;

        const asset = response.assets?.[0];
        if (!asset?.uri) return null;

        const extension = getFileExtension(asset.type);
        const nameGuess = asset.fileName || `photo.${extension}`;

        const cached = await ensureInCache(asset.uri, nameGuess);

        return {
            uri: cached,               // app-private file:// URI
            fileName: nameGuess,
            fileSize: asset.fileSize,
            type: asset.type,
        };
    } catch (e) {
        console.error('takePrivatePhoto error:', e);
        Alert.alert('Error', 'Failed to take photo.');
        return null;
    }
}

/** Helpers */
export function formatFileSize(bytes?: number): string {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
