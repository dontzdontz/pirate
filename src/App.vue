<script setup>
import { onBeforeMount, ref, onMounted, watch } from "vue";
import axios from "axios";
const loading = ref(false);

import pirate_2_b from "./assets/images/pirate_2_b.png";
import pirate_0_b from "./assets/images/pirate_0_b.png";
import pirate_0 from "./assets/images/pirate_0.png";
import pirate_1_b from "./assets/images/pirate_1_b.png";
import pirate_3_b from "./assets/images/pirate_3_b.png";
import pirate_1 from "./assets/images/pirate_1.png";
import pirate_2 from "./assets/images/pirate_2.png";
import pirate_3 from "./assets/images/pirate_3.png";

const round = ref(1);
const pirates = ref([
  {
    back: pirate_0_b,
    front: pirate_0,
    bonus_back: pirate_3_b,
    bonus_front: pirate_3,
    isTurn: false,
  },
  {
    back: pirate_1_b,
    front: pirate_1,
    bonus_back: pirate_3_b,
    bonus_front: pirate_3,
    isTurn: false,
  },
  {
    back: pirate_2_b,
    front: pirate_2,
    bonus_back: pirate_3_b,
    bonus_front: pirate_3,
    isTurn: false,
  },
]);

const questions = ref([[], [], [], [], []]);
const bonusIndices = ref([]);
axios
  .get(
    "https://sheets.googleapis.com/v4/spreadsheets/1XpAMwdU1gTYahErh1ny0k2a2TuLDhuIFvDE-s-hO0ag/values/0?alt=json&key=AIzaSyDR4LE-SY5jBNCMJ0HHgxJfgGd3amRyRmc"
  )
  .then((res) => {
    questions.value = res.data.values.reduce((acc, cur) => {
      const [first, ...rest] = cur;
      bonusIndices.value.push(+rest[3]);
      return [...acc, [rest[0], rest[1], rest[2]]];
    }, []);

    loading.value = false;
    console.log(questions.value);
  });

// const waiting = ref(true);

const turnAllBack = () => {
  pirates.value.forEach((i) => (i.isTurn = false));
};

onBeforeMount(() => {
  window.addEventListener("keydown", (e) => {
    // enter
    if (e.keyCode === 13) {
      if (round.value < 5) {
        turnAllBack();
        round.value += 1;
      } else {
        round.value = 1;
      }
    }

    // console.log(e.keyCode);
    if (e.keyCode === 27) {
      window.close();
      return;
    }

    // 0: resume game
    if (e.keyCode === 48 || e.keyCode === 96) {
      round.value = 1;
      return;
    }

    // 1: 49 2:50 3:51
    if (e.keyCode === 49 || e.keyCode === 97) {
      pirates.value[0].isTurn = !pirates.value[0].isTurn;
    }
    if (e.keyCode === 50 || e.keyCode === 98) {
      pirates.value[1].isTurn = !pirates.value[1].isTurn;
    }
    if (e.keyCode === 51 || e.keyCode === 99) {
      pirates.value[2].isTurn = !pirates.value[2].isTurn;
    }
  });
});

const isChinese = (str) => {
  const pattern = new RegExp("[\u4E00-\u9FA5]+");
  return pattern.test(str);
};
</script>

<template>
  <!-- <div v-if="waiting" class="welcome">
    <img src="./assets/banner.png" alt="" />
  </div> -->
  <div v-if="!loading" class="container">
    <h1 class="">ROUND {{ round }}</h1>
    <div class="img-container">
      <div class="img-wrapper" v-for="(i, index) in pirates">
        <img
          v-show="!i.isTurn && bonusIndices[round - 1] !== index + 1"
          :src="i.back"
        />
        <img
          v-show="i.isTurn && bonusIndices[round - 1] !== index + 1"
          :src="i.front"
        />

        <img
          v-show="!i.isTurn && bonusIndices[round - 1] === index + 1"
          :src="i.bonus_back"
        />
        <img
          v-show="i.isTurn && bonusIndices[round - 1] === index + 1"
          :src="i.bonus_front"
        />
        <span
          v-if="i.isTurn"
          :style="
           questions[round - 1][index] === '𠢕' ?
           {fontSize: '12vw' } :
            questions[round - 1][index].length > 5
              ? { fontSize: '5vw', color: '#1d3760', '-webkit-text-stroke': '0px' }
              : questions[round - 1][index].length >= 2
              ? { fontSize: '9vw', color: '#1d3760', '-webkit-text-stroke': '0px' }
              : { fontSize: '12vw' }
          "
          >{{
            questions[round - 1].length > 0 ? questions[round - 1][index] : ""
          }}</span
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@700&display=swap');
#app {
  
  // font-family: Arial, "Arial", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

body {
  background: url("./assets/bg.jpg");
  /* fallback for old browsers */
  background-size: cover;
  height: 100%;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
}

.container {
  margin: auto;
  width: 90vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: 8rem;
    font-weight: bold;
    color: rgb(80, 61, 61);
    margin: 0;
  }

  .img-container {
    display: grid;
    grid-template-columns: repeat(3, 28vw);
    gap: 8px;
    justify-content: center;

    .img-wrapper {
      position: relative;

      span {
        position: absolute;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        top: 65%;
        width: 100%;
        text-align: center;
        font-size: 12vw;
        font-weight: bold;
        color: #1d3760;

        // text-shadow: 5px 5px 0 #1d3760, -1px -1px 0 #1d3760, 1px -1px 0 #1d3760, -1px 1px 0 #1d3760, 1px 1px 0 #1d3760;
        // -webkit-text-stroke: 6px #1d3760;
      }
    }
  }

  img {
    width: 100%;
  }
}

.block {
  background: url("assets/block.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
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
      content: "";
      background: url("./assets/border.png");
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
    }
  }

  h1 {
    margin: 0;
    font-size: 36px;
    color: #593328;
  }
}

.wrong-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;

  .wrong {
    width: 100%;
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

.welcome {
  background: url("assets/welcome.jpg");
  background-size: cover;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;

  img {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    top: 50%;
    animation: disappear 1.5s infinite;
  }
}

@keyframes disappear {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}
</style>
