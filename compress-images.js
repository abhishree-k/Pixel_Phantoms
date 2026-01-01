import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  'assets/demo.png',
  'assets/host-event.jpg',
  'assets/logo.png'
];

/**
 * Compress an image using Sharp with appropriate settings
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to output image
 * @returns {Promise<Object>} Compression stats
 */
async function compressImage(inputPath, outputPath) {
  const fullInputPath = path.resolve(__dirname, inputPath);
  const fullOutputPath = path.resolve(__dirname, outputPath);

  // Check if input file exists
  if (!fs.existsSync(fullInputPath)) {
    throw new Error(`Input file not found: ${fullInputPath}`);
  }

  // Get input file stats
  const inputStats = fs.statSync(fullInputPath);
  const inputSize = inputStats.size;

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(fullOutputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const ext = path.extname(inputPath).toLowerCase();
  let pipeline = sharp(fullInputPath);

  // Configure compression based on file type
  if (ext === '.png') {
    // PNG: Use compressionLevel (0-9), not quality
    pipeline = pipeline.png({ 
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: true
    });
  } else if (ext === '.jpg' || ext === '.jpeg') {
    // JPEG: Use quality (1-100) and optimize
    pipeline = pipeline.jpeg({ 
      quality: 80,
      mozjpeg: true,
      progressive: true
    });
  } else if (ext === '.webp') {
    // WebP: Use quality and lossless option
    pipeline = pipeline.webp({ 
      quality: 80,
      effort: 6
    });
  } else {
    throw new Error(`Unsupported file format: ${ext}`);
  }

  // Compress and save
  await pipeline.toFile(fullOutputPath);

  // Get output file stats
  const outputStats = fs.statSync(fullOutputPath);
  const outputSize = outputStats.size;
  const compressionRatio = ((1 - outputSize / inputSize) * 100).toFixed(2);

  return {
    inputPath,
    outputPath,
    inputSize,
    outputSize,
    compressionRatio: `${compressionRatio}%`
  };
}

/**
 * Main function to compress all images
 */
async function main() {
  console.log('Starting image compression...\n');
  
  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (const image of images) {
    const outputPath = image.replace(path.extname(image), '_compressed' + path.extname(image));
    
    try {
      const stats = await compressImage(image, outputPath);
      results.push(stats);
      successCount++;
      
      console.log(`✓ Compressed: ${image}`);
      console.log(`  Input:  ${(stats.inputSize / 1024).toFixed(2)} KB`);
      console.log(`  Output: ${(stats.outputSize / 1024).toFixed(2)} KB`);
      console.log(`  Saved:  ${stats.compressionRatio}\n`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Error compressing ${image}:`, error.message);
    }
  }

  // Summary
  console.log('='.repeat(50));
  console.log(`Compression completed!`);
  console.log(`Success: ${successCount}, Errors: ${errorCount}`);
  
  if (results.length > 0) {
    const totalInputSize = results.reduce((sum, r) => sum + r.inputSize, 0);
    const totalOutputSize = results.reduce((sum, r) => sum + r.outputSize, 0);
    const totalSaved = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(2);
    
    console.log(`Total size reduction: ${totalSaved}%`);
    console.log(`Total saved: ${((totalInputSize - totalOutputSize) / 1024).toFixed(2)} KB`);
  }
}

// Run with error handling
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

