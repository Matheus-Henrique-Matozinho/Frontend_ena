<template>
  <i
    class="led"
    :class="{ on: isOn }"
    :style="{
      backgroundColor: color,
      '--glow-color': color
    }"
    @click="toggleOnClick ? toggle() : null"
  ></i>
</template>

<script>
export default {
  name: 'SingleLed',
  props: {
    color: {
      type: String,
      default: '#ff4500' // Default to orange/red
    },
    isOn: {
      type: Boolean,
      default: false
    },
    toggleOnClick: {
      type: Boolean,
      default: false // Allow toggle on click (optional)
    }
  },
  emits: ['update:isOn'],
  methods: {
    toggle() {
      this.$emit('update:isOn', !this.isOn);
    }
  }
}
</script>

<style scoped>
.led {
  font-size: 1em;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.61);
  margin: 0;
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1em;
  background: #808080;
  border-radius: 50%;
  vertical-align: text-bottom;
  box-shadow: inset .25em .25em .25em rgba(255,255,255,.25), inset -.25em -.25em .25em .5em rgba(0,0,0,.25), inset 1em .5em .5em rgba(0,0,0,.5);
  &:before {
    content: '';
    border-radius: 50%;
    display: block;
    width: .25em;
    height: .25em;
    background: #fff;
    opacity: .1;
    margin-top: .2em;
    margin-left: .2em;
    mix-blend-mode: overlay;
  }
  &.led-xs {
    font-size: 50%;
  }
  &.led-sm {
    font-size: 80%;
  }
  &.on {
    box-shadow: 0 0 .25em .1em, 0 0 1em .5em;
    box-shadow:
        0 0 .25em .1em var(--glow-color),
        0 0 1em .5em var(--glow-color);
        border: 1px solid rgba(0, 0, 0, 0);
    &.blink {
      -webkit-animation: blink .5s infinite;
      -moz-animation:    blink .5s infinite;
      -o-animation:      blink .5s infinite;
      animation:         blink .5s infinite;
    }
  }
}

@keyframes blink {
  0% {
    border: 1px solid rgba(0,0,0,.75);
      box-shadow: inset .25em .25em .25em var(--glow-color), inset -.25em -.25em .25em .5em var(--glow-color), inset 1em .5em .5em var(--glow-color);
  }
  50% {
    border: 2px solid rgba(0,0,0,.05);
      box-shadow: 0 0 .25em .1em, 0 0 1em .5em;
  }
  100% {
    border: 1px solid rgba(0,0,0,.75);
      box-shadow: inset .25em .25em .25em var(--glow-color), inset -.25em -.25em .25em .5em var(--glow-color), inset 1em .5em .5em var(--glow-color);
  }
}
</style>
