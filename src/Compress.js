import Base64 from './core/base64.js'
import Converter from './core/converter.js'
import File from './core/file.js'
import Image from './core/image.js'
import Photo from './core/Photo.js'

const Compress = function () {
  function attach (el, options) {
    return new Promise((resolve, reject) => {
      const input = document.querySelector(el)
      input.setAttribute('accept', 'image/*')
      input.addEventListener('change', (evt) => {
        const output = compressFiles([...evt.target.files], options)
        resolve(output)
      }, false)
    })
  }

  function compressFiles (files, options) {
    return Promise.all(files.map((file) => {
      return compressFile(file, options)
    }))
  }

  /*
   * Compress a single image file into base64 string with reduced size
  **/
  function compressFile (file, options) {
    // Create a new photo object
    const photo = new Photo(options)
    photo.start = performance.now()
    photo.alt = file.name
    photo.ext = file.type
    photo.startSize = file.size

    return File.load(file).then(compressImage(photo))
  }

  function compressImage (photo) {
    return (src) => {
      return Image.load(src).then((img) => {
        // Store the initial dimensions
        photo.startWidth = img.naturalWidth
        photo.startHeight = img.naturalHeight
        // Resize the image
        if (photo.resize) {
          const { width, height } = Image.resize(photo.maxWidth, photo.maxHeight)(img.naturalWidth, img.naturalHeight)
          photo.endWidth = width
          photo.endHeight = height
        } else {
          photo.endWidth = img.naturalWidth
          photo.endHeight = img.naturalHeight
        }
        return Converter.imageToCanvas(photo.endWidth, photo.endHeight)(img)
      })
      .then((canvas) => {
        photo.iterations = 1
        photo.base64prefix = Base64.prefix(Base64.mime(Converter.canvasToBase64(canvas)))
        return loopCompression(canvas, photo.startSize, photo.quality, photo.size, photo.minQuality, photo.iterations)
      })
      .then((base64) => {
        photo.finalSize = Base64.size(base64)
        return Base64.data(base64)
      })
      .then((data) => {
        photo.end = performance.now()
        const difference = photo.end - photo.start // in ms

        return {
          data: data,
          prefix: photo.base64prefix,
          elapsedTime: difference / 1000, // in seconds
          alt: photo.alt,
          initialSize: Converter.size(photo.startSize).MB,
          endSize: Converter.size(photo.finalSize).MB,
          ext: photo.ext,
          quality: photo.quality,
          endWidth: photo.endWidth,
          endHeight: photo.endHeight,
          initialWidth: photo.startWidth,
          initialHeight: photo.startHeight,
          sizeReduced: (photo.startSize - photo.finalSize) / photo.startSize * 100,
          iterations: photo.iterations
        }
      })
    }
  }
  function loopCompression (canvas, size, quality = 1, targetSize, targetQuality = 1, iterations) {
    const base64str = Converter.canvasToBase64(canvas)
    const newSize = Base64.size(base64str)
    // const base64str = convertCanvasToBase64(src)
    // const size = getFileSize(base64str);
    iterations += 1
    // add in iteration count

    if (newSize > targetSize) {
      return loopCompression(canvas, newSize, quality - 0.1, targetQuality, targetSize, iterations)
    }

    if (quality > targetQuality) {
      return loopCompression(canvas, newSize, quality - 0.1, targetQuality, targetSize, iterations)
    }

    if (quality < 0.5) {
      return base64str
    }
    return base64str
  }

  return {
    compress: compressFiles,
    // URL: '',
    attach: attach
  }
}

// Supported input formats
// image/png, image/jpeg, image/jpg, image/gif, image/bmp, image/tiff, image/x-icon,  image/svg+xml, image/webp, image/xxx
// image/png, image/jpeg, image/webp
module.exports = Compress