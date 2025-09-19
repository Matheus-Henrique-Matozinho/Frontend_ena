<!-- CameraFeed.vue -->
<template>
  <div class="camera-feed">
    <h2>Intelbras Camera Feed</h2>
    <img
      :src="cameraUrl"
      alt="Live Camera Feed"
      width="640"
      height="480"
    />
  </div>
</template>

<script>
export default {
  name: 'CameraFeed',
  data() {
    return {
      cameraUrl:
        'http://admin:tcs1234!@192.168.18.169/cgi-bin/mjpg/video.cgi?channel=1&subtype=1',
    };
  },
};
</script>

<style scoped>
.camera-feed {
  text-align: center;
}
img {
  border: 1px solid #ccc;
}
</style>
