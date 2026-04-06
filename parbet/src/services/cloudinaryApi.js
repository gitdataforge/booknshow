/**
 * Cloudinary API Service (2026 Edition)
 * Handles high-end, real-time asset uploads using Unsigned Presets.
 * Bypasses Firebase Storage to provide global CDN delivery for Parbet assets.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads a file (Image or PDF) directly to Cloudinary's CDN.
 * @param {File} file - The file object from a native HTML file input
 * @param {string} folder - Destination folder (e.g., 'avatars', 'tickets')
 * @returns {Promise<Object>} - The Cloudinary response object containing secure URLs and metadata
 */
export const uploadToCloudinary = async (file, folder = 'general') => {
    if (!file) {
        throw new Error('No file provided for upload.');
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error('Cloudinary environment variables are missing. Please check your .env file.');
    }

    // Initialize Multipart Form Data for secure Unsigned Uploads
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    // Dynamically assign folder structure to keep Media Library clean
    formData.append('folder', `parbet/${folder}`); 

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, // 'auto' handles both images and raw files (PDFs)
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Cloudinary upload failed.');
        }

        const data = await response.json();
        
        // Return highly structured real-time data back to the UI components
        return {
            url: data.secure_url,
            publicId: data.public_id,
            format: data.format,
            bytes: data.bytes,
            width: data.width,
            height: data.height,
            createdAt: data.created_at,
            resourceType: data.resource_type
        };
    } catch (error) {
        console.error('Cloudinary Service Error:', error);
        throw error;
    }
};

/**
 * Specialized hook for User Avatars
 * Implements logic for real-time auto-optimization and AI-based face-detection cropping.
 */
export const uploadUserAvatar = async (file, userId) => {
    const result = await uploadToCloudinary(file, `users/${userId}/avatar`);
    
    // Apply Cloudinary's real-time transformation logic for profile pictures
    // Injects parameters to resize, focus on faces, and auto-compress without losing quality
    if (result.resourceType === 'image') {
        const optimizedUrl = result.url.replace('/upload/', '/upload/w_400,h_400,c_fill,g_face,q_auto,f_auto/');
        return { ...result, url: optimizedUrl };
    }
    
    return result;
};

/**
 * Specialized hook for Secure Ticket PDFs
 * Ensures digital ticket assets are grouped into the secure tickets sub-hierarchy.
 */
export const uploadTicketDocument = async (file, listingId) => {
    // Note: PDFs often return as resource_type: 'image' in Cloudinary unless explicitly told, 
    // but the 'auto' endpoint handles the delivery format correctly.
    return await uploadToCloudinary(file, `tickets/${listingId}`);
};

/**
 * Specialized hook for CMS Site Banners
 * Built to be utilized by the Parbet Seller platform to overwrite Main Site Hero assets.
 */
export const uploadSiteAsset = async (file, assetType) => {
    return await uploadToCloudinary(file, `site_assets/${assetType}`);
};