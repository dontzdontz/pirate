<script setup>
import { getCurrentInstance, onBeforeMount, ref, onMounted, watch } from "vue";
import Papa from "papaparse";
import axios from "axios";
let blockValues = ref([1, 2, 3]);
const activeCode = ref();
const loading = ref(true)
const error = ref(false);

axios
  .get(
    "https://script.google.com/macros/s/AKfycbyPcbm2nt-cnA2zse5KHEIHFPi674wQx6WWdZwvf_CQJomge-7NC_RellTzhlX7eLjHXg/exec"
  )
  .then((res) => {
    const data = JSON.parse(res.data);
    blockValues.value = Object.keys(data).map((i) => {
      return {
        answer: i,
        keyCode: data[i],
        result: null,
      };
    });

    blockValues.value.sort((start, next) => {
      const order = [49, 50, 51, 52, 81, 87, 69, 82, 65, 83, 68, 70, 90, 88, 67, 86];
      return order.indexOf(start.keyCode) - order.indexOf(next.keyCode);
    });

    loading.value = false
  });

const clearValues = () => {
  blockValues.value.forEach((i) => (i.result = null));
};

onBeforeMount(() => {
  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
      window.close();
      return;
    }

    // backspace
    if (e.keyCode === 8) {
      blockValues.value[activeCode.value].result = null;
    }

    // // space
    // if (e.keyCode === 32) {
    //   error.value = true;
    //   setTimeout(() => {
    //     error.value = false;
    //   }, 2000);
    //   return;
    // }

    // enter
    if (e.keyCode === 13) {
      clearValues();
      return;
    }
    

    const activeIndex = blockValues.value.findIndex((i) => i.keyCode === e.keyCode);

    if ((event.shiftKey) && (activeIndex!== -1)) {
      activeCode.value = activeIndex;
      blockValues.value[activeIndex].result = false;
      setTimeout(() => {
        blockValues.value[activeIndex].result = null;
      }, 2000);
      return
    }
    if (activeIndex !== -1) {
      activeCode.value = activeIndex;
      blockValues.value[activeIndex].result = true;
    }
  });
});

// const res = Papa.parse("./questions.csv", {
//   download: true,
//   complete: (results) => {
//     const datas = results.data;
//     datas.shift(0);
//     const trueCodes = [0, "O", "o", "Ｏ", "ｏ"];
//     const falseCodes = ["x", "X", "Ｘ", "ｘ"];
//     blockValues.value = datas.map((i) => {
//       return {
//         question: i[0],
//         ans: trueCodes.includes(i[1]) ? 79 : 88,
//         result: null,
//       };
//     });
//   },
// });
</script>

<template>
  
  <div v-if="loading" class="wrong-container">
    <img src="./assets/loading.gif" />
  </div>
  <div v-else class="container">
    <div
      class="block"
      :class="item.result === true ? 'correct' : item.result === false ? 'wrong' : ''"
      v-for="(item, index) in blockValues"
      :key="`${item.answer}-${index}`"
    >
      <h1 v-html="item.answer"></h1>
      <div v-show="item.result === false" class="wrong-container">
      <img class="wrong" src="./assets/wrong.png" />
    </div>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

body {
  background: url('assets/bg.jpg'); /* fallback for old browsers */
  height: 100vh;
  margin: 0;
}

.container {
  margin: auto;
  width: 80vw;
  height: auto;
  display: grid;
  grid-template-columns: repeat(4, 120px);
  grid-template-rows: repeat(4, 120px);
  justify-content: center;
}
.block {
  background: #ffe24a;
  border: 1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  padding: 4px;
  p {
    margin: 0;
  }
  &.correct {
    position: relative;
    &::before {
      position: absolute;
      top: 6px;
      content: "";
      border: 4px solid #f14343;
      border-radius: 100%;
      width: 100px;
      height: 100px;
    }
  }
  &.wrong {
    background: #d33e3e;
  }
  h1 {
    margin: 0;
    font-size: 16px;
  }
}


.wrong-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.3);
  z-index: 100;
  .wrong {
    width: 300px;
    animation: rubberBand 0.8s;
    animation-iteration-count: 3;
  }
}

@keyframes rubberBand {
  from {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5);
  }

  to {
    transform: scale(1);
  }
}

.rubberBand {
  -webkit-animation-name: rubberBand;
  animation-name: rubberBand;
}
</style>
