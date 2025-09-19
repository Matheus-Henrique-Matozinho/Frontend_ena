<template>
  <div class="webcam-container">
    <video ref="video" autoplay playsinline @loadedmetadata="startFrameCapture" />
    <canvas ref="canvas" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Props
const props = defineProps({
  frameInterval: {
    type: Number,
    default: 3000, // default frame capture interval in ms
  }
})

const emit = defineEmits(['frameCaptured'])

const video = ref(null)
const canvas = ref(null)
let intervalId = null

// Setup canvas dimensions
const setupCanvas = (width, height) => {
  if (canvas.value) {
    canvas.value.width = width
    canvas.value.height = height
  }
}

// Fallback: Use image if webcam access fails
const startFallbackImage = () => {
  const img = new Image()
  img.src = '/image.png' // Ensure image is in /public

  img.onload = () => {
    setupCanvas(img.naturalWidth, img.naturalHeight)
    const ctx = canvas.value.getContext('2d')

    intervalId = setInterval(() => {
      ctx.drawImage(img, 0, 0, canvas.value.width, canvas.value.height)
      emit('frameCaptured', canvas.value)
    }, props.frameInterval)
  }

  img.onerror = (e) => {
    console.error('Fallback image failed to load:', e)
  }
}

// Start webcam stream
const startWebcam = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (video.value) {
      video.value.srcObject = stream
    }
  } catch (error) {
    console.error('Webcam access failed. Using fallback image.', error)
    startFallbackImage()
  }
}

// Start capturing frames from the webcam
const startFrameCapture = () => {
  const videoEl = video.value
  const canvasEl = canvas.value
  if (!videoEl || !canvasEl) return

  setupCanvas(videoEl.videoWidth, videoEl.videoHeight)
  const ctx = canvasEl.getContext('2d')

  intervalId = setInterval(() => {
    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height)
    emit('frameCaptured', canvasEl)
  }, props.frameInterval)
}

// Cleanup
const stopWebcam = () => {
  clearInterval(intervalId)

  const stream = video.value?.srcObject
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }

  if (video.value) {
    video.value.srcObject = null
  }
}

// Lifecycle
onMounted(() => {
  startWebcam()
})

onBeforeUnmount(() => {
  stopWebcam()
})
</script>

<style scoped>
.webcam-container {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
}

.webcam-container video,
.webcam-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.webcam-container video {
  display: none;
}
</style>
