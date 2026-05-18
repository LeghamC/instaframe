<template>
  <div class="device-wrapper" :class="`device-${device}`">
    <div class="device-outer">
      <!-- Dynamic island / notch -->
      <div class="device-notch" :class="notchClass"></div>
      <!-- Side buttons -->
      <div class="device-btn-left"></div>
      <div class="device-btn-right"></div>
      <!-- Screen -->
      <div class="device-screen">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  device: { type: String, default: 'iphone16pro' }
})

const notchClass = computed(() => {
  if (props.device.includes('iphone16')) return 'dynamic-island'
  if (props.device.includes('iphone14') || props.device.includes('iphone13')) return 'notch-standard'
  if (props.device.includes('samsung')) return 'notch-punch'
  if (props.device.includes('pixel')) return 'notch-punch pixel-punch'
  return 'notch-standard'
})
</script>

<style scoped>
.device-wrapper {
  display: flex; justify-content: center; align-items: flex-start;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}

.device-outer {
  position: relative;
  border-radius: 54px;
  overflow: hidden;
  box-shadow:
    0 0 0 2px #555,
    0 0 0 4px #222,
    0 0 0 8px #111,
    0 30px 80px rgba(0,0,0,0.9),
    inset 0 0 0 1px rgba(255,255,255,0.08);
}

/* iPhone 16 Pro - titanium look */
.device-iphone16pro .device-outer {
  width: 390px;
  background: linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 100%);
  box-shadow:
    0 0 0 2px #7a6d5e,
    0 0 0 4px #3a3228,
    0 0 0 10px #1a1610,
    0 40px 100px rgba(0,0,0,0.95),
    inset 0 0 0 1px rgba(255,200,100,0.1);
}

/* iPhone 16 - aluminum */
.device-iphone16 .device-outer {
  width: 380px;
  background: linear-gradient(160deg, #3a3a3a 0%, #242424 100%);
}

/* Samsung S24 Ultra */
.device-samsungs24ultra .device-outer {
  width: 380px; border-radius: 44px;
  background: linear-gradient(160deg, #1a1a2e 0%, #0f0f1e 100%);
  box-shadow:
    0 0 0 2px #4a4a6a,
    0 0 0 4px #1a1a2e,
    0 0 0 10px #0a0a0f,
    0 40px 100px rgba(0,0,100,0.4),
    inset 0 0 0 1px rgba(100,100,255,0.1);
}

/* Pixel 9 Pro */
.device-pixel9pro .device-outer {
  width: 370px; border-radius: 40px;
  background: linear-gradient(160deg, #2d2d2d 0%, #1c1c1c 100%);
}

/* Screen */
.device-screen {
  width: 100%;
  height: 700px;
  background: #000;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  position: relative;
}
.device-screen::-webkit-scrollbar { display: none; }

/* Notch variants */
.device-notch {
  position: absolute; top: 16px; left: 50%; transform: translateX(-50%);
  z-index: 10; pointer-events: none;
}
.dynamic-island {
  width: 110px; height: 34px;
  background: #000; border-radius: 20px;
}
.notch-standard {
  width: 140px; height: 30px;
  background: #000; border-radius: 0 0 20px 20px;
  top: 0;
}
.notch-punch {
  width: 12px; height: 12px;
  background: #000; border-radius: 50%;
  top: 20px;
}
.pixel-punch { top: 14px; }

/* Side buttons */
.device-btn-left, .device-btn-right {
  position: absolute; top: 120px;
  width: 4px; height: 60px;
  background: #555; border-radius: 2px;
}
.device-btn-left { left: -3px; }
.device-btn-right { right: -3px; }

/* Screen padding top for notch */
.device-iphone16pro .device-screen,
.device-iphone16 .device-screen { padding-top: 60px; }
.device-samsungs24ultra .device-screen,
.device-pixel9pro .device-screen { padding-top: 50px; }

@media (max-width: 900px) {
  .device-outer { transform: scale(0.75); transform-origin: top center; }
  .device-wrapper { min-height: 540px; }
}

@media (max-width: 600px) {
  .device-outer { transform: scale(0.62); transform-origin: top center; }
  .device-wrapper { min-height: 450px; }
}
</style>
