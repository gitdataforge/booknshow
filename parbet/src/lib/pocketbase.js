import PocketBase from 'pocketbase';

/**
 * FEATURE 1: Official PocketBase SDK Initialization
 * FEATURE 2: Environment Variable Routing (Hugging Face Space)
 * FEATURE 3: Auto-Cancellation Override (Prevents concurrent upload aborts)
 * FEATURE 4: Multipart Form-Data Construction Engine
 * FEATURE 5: Direct Public URL Generation
 */

// Initialize the PocketBase client
// Ensure you add VITE_POCKETBASE_URL to your .env file
// Example: VITE_POCKETBASE_URL=https://parbet-images.hf.space
const pbUrl = import.meta.env.VITE_POCKETBASE_URL || 'https://parbet-images.hf.space';
export const pb = new PocketBase(pbUrl);

// FEATURE 3: Globally disable auto cancellation
// This ensures that if an admin uploads multiple images rapidly, 
// the SDK does not cancel previous pending network requests.
pb.autoCancellation(false);

/**
 * FEATURE 4 & 5: Direct Image Upload Engine
 * Safely processes a raw File object, uploads it to the 'event_images' 
 * collection in PocketBase, and returns the strictly formatted public URL.
 * * @param {File} file - The raw image file object from an HTML file input.
 * @returns {Promise<{success: boolean, url: string, id: string}>}
 */
export const uploadEventImage = async (file) => {
    if (!file) {
        throw new Error("No valid file object provided for upload.");
    }

    try {
        // Construct the multipart form payload required by PocketBase
        const formData = new FormData();
        formData.append('image', file);

        // Execute the network upload to the specific collection
        // Note: You MUST create a collection named 'event_images' in your PB Admin UI 
        // with a file field named 'image'.
        const record = await pb.collection('event_images').create(formData);

        // Construct the immutable public URL for the uploaded image
        // PocketBase format: {server_url}/api/files/{collectionId}/{recordId}/{filename}
        const imageUrl = `${pbUrl}/api/files/${record.collectionId}/${record.id}/${record.image}`;

        console.log(`[PocketBase Upload] Success: ${imageUrl}`);
        return { success: true, url: imageUrl, id: record.id };
        
    } catch (error) {
        console.error("[PocketBase Protocol] Upload failed:", error);
        throw new Error(error.message || "Failed to upload image to the PocketBase backend.");
    }
};