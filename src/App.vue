<script setup>
import { getCurrentInstance, onBeforeMount, ref, onMounted, watch } from "vue";
import Papa from "papaparse";
let blockValues = ref([1, 2, 3]);
const activeQuestion = ref();
const questionNumber = ref();
const showModal = ref(false);
const showResult = ref(false);
const selectAns = ref();
const isActive = ref(false);

const clearValues = () => {
  selectAns.value = "";
  questionNumber.value = "";
  isActive.value = false;
  showModal.value = false;
  showResult.value = false;
};

watch(
  () => questionNumber.value,
  (newV, oldV) => {
    const regex = /^\d+$/;
    const isDigit = regex.test(newV);
    if (isDigit) return;
    questionNumber.value = newV === "" ? "" : oldV;
  }
);

onBeforeMount(() => {
  window.addEventListener("keydown", (e) => {
    console.log(e.keyCode)
    if(e.keyCode === 27) {
      window.close()
      return
    }
    if (!isActive.value) return;
    const activeKeys = [88, 79, 90, 32];
    if (e.keyCode === 90) {
      clearValues();
      return;
    }
    if (selectAns.value === +e.keyCode || !activeKeys.includes(e.keyCode))
      return;
    if (!showModal.value) return;
    selectAns.value = +e.keyCode;
    checkAns();
  });
});

const checkAns = () => {
  changeStatus(selectAns.value === activeQuestion.value.ans);
  showResult.value = true;

  setTimeout(() => {
    clearValues();
  }, 1200);
};

const changeStatus = (res) => {
  const activeIndex = blockValues.value.findIndex(
    (i) => i.question === activeQuestion.value.question
  );
  blockValues.value[activeIndex].result = res;
};

const res = Papa.parse("./questions.csv", {
  download: true,
  complete: (results) => {
    const datas = results.data;
    datas.shift(0);
    const trueCodes = [0, "O", "o", "Ｏ", "ｏ"];
    const falseCodes = ["x", "X", "Ｘ", "ｘ"];
    blockValues.value = datas.map((i) => {
      return {
        question: i[0],
        ans: trueCodes.includes(i[1]) ? 79 : 88,
        result: null,
      };
    });
  },
});

const selectQuestion = () => {
  const availableNumbers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];
  if (!availableNumbers.includes(+questionNumber.value)) {
    alert("請輸入正確的題目編號");
    questionNumber.value = "";
    return;
  }
  showModal.value = true;
  const number = +questionNumber.value - 1;
  activeQuestion.value = blockValues.value[number];
  isActive.value = true;
};
</script>

<template>
  <p class="title">
    請輸入數字，並按下空白鍵表示選擇。<br />選擇題目後，如想更換題目，請按下z鍵。
  </p>
  <input
    class="number-input"
    maxlength="2"
    v-model="questionNumber"
    @keyup.space="selectQuestion"
  />
  <div class="container">
    <div
      class="block"
      :class="
        item.result === true ? 'correct' : item.result === false ? 'wrong' : ''
      "
      v-for="(item, index) in blockValues"
    >
      <h1>{{ index + 1 }}</h1>
      <p>{{ item.question }}</p>
      <div v-show="item.result !== null">{{ item.ans === 79 ? "O" : "X" }}</div>
    </div>
  </div>

  <div v-show="showModal || showResult" class="backdrop"></div>

  <div v-show="showModal" class="modal">
    <p>{{ activeQuestion?.question }}</p>
    <div class="modal__action">
      <button :class="selectAns === 79 ? 'active' : ''">O</button>
      <button :class="selectAns === 88 ? 'active' : ''">X</button>
    </div>
  </div>

  <div v-show="showResult" class="modal">
    <div v-if="activeQuestion?.result === true">
      <img src="@/assets/correct.png" />
      <p>答對囉</p>
    </div>
    <div v-else>
      <img src="@/assets/wrong.png" />
      <p>答錯囉</p>
    </div>
  </div>
  <div class="bg"></div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  text-align: center;
}

body {
  background: #7474bf; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #348ac7,
    #7474bf
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #348ac7,
    #7474bf
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.container {
  margin: auto;
  width: 80vw;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 120px);
  grid-template-rows: repeat(4, 120px);
  justify-content: center;
}
.block {
  background: #f0f0f0;
  border: 1px solid #cdcdcd;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding-top: 16px;
  p {
    margin: 0;
  }
  &.correct {
    background: #e6fada;
  }
  &.wrong {
    background: #d33e3e;
  }
  h1 {
    margin: 0;
    font-size: 24px;
  }
  &:hover {
    background: #e1e1ee1;
  }
}

.modal {
  position: absolute;
  top: 25vh;
  left: 50%;
  transform: translate(-50%);
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 16px;
  padding: 12px 16px;
  width: 50%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: #4d4d4d;

  img {
    width: 40%;
  }
  &__action {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  p {
    font-size: 40px;
    margin: 0;
  }
  button {
    font-size: 60px;
    width: 160px;
    height: 160px;
    border-radius: 100%;
    box-shadow: none;
    border: 1px solid;
    &:first-child {
      background: #5dc482;
      color: #fff;
    }
    &:last-child {
      background: #d33e3e;
      color: #fff;
    }
    &.select {
      background: #5dc482;
      border: 1px solid #3fac69;
      color: #fff;
    }
  }
}

.backdrop {
  width: 100%;
  height: 100%;
  position: fixed;
  background: #000000ad;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.number-input {
  margin-bottom: 20px;
  text-align: center;
  border: 1px dashed cornflowerblue;
  height: 80px;
  width: 80px;
  font-size: 40px;
  color: cornflowerblue;
  border-radius: 100px;
}

.title {
  font-size: 14px;
  color: #fff;
}

.bg {
  background: #ffffff;
  width: 200%;
  height: 60vh;
  left: -100px;
  position: fixed;
  z-index: -1;
  transform: rotate(7deg);
  bottom: -31vh;
  opacity: 0.4;
}
</style>
