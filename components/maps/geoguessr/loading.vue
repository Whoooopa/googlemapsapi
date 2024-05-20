<template>
  <div class="w-screen h-screen flex items-center justify-center gap-2 text-xl font-extrabold bg-purple-500 text-white">
    <div class="jump1 bg-transparent">L</div>
    <div class="jump2 bg-transparent">o</div>
    <div class="jump3 bg-transparent">a</div>
    <div class="jump4 bg-transparent">d</div>
    <div class="jump5 bg-transparent">i</div>
    <div class="jump6 bg-transparent">n</div>
    <div class="jump7 bg-transparent">g</div>
    <div class="jump8 bg-white rounded-full w-2 h-2 mt-2"></div>
    <div class="jump9 bg-white rounded-full w-2 h-2 mt-2"></div>
    <div class="jump10 bg-white rounded-full w-2 h-2 mt-2"></div>
 </div>
</template>

<script setup>

</script>

<style scoped>
.jump1 {
  animation: typing2 1.5s linear infinite;
  animation-delay: 0.1s;
}

.jump2 {
  animation: typing2 1.5s linear infinite;
  animation-delay: 0.2s;
}

.jump3 {
  animation: typing2 1.5s linear infinite;
  animation-delay: 0.3s;
}

.jump4 {
  animation: typing2 1.5s linear infinite;
  animation-delay: 0.4s;
}

.jump5 {
  animation: typing2 1.5s linear infinite;
  animation-delay: 0.5s;
}

.jump6 {
  animation: typing2 1.5s linear infinite;
  animation-delay: 0.6s;
}

.jump7 {
  animation: typing2 1.5s linear infinite;
  animation-delay: 0.7s;
}

.jump8 {
  animation: typing 1.5s linear infinite;
  animation-delay: 0.8s;
}

.jump9 {
  animation: typing 1.5s linear infinite;
  animation-delay: 0.9s;
}

.jump10 {
  animation: typing 1.5s linear infinite;
  animation-delay: 1.0s;
}

@keyframes typing {
0% {
 transform: translateY(0px);
}

25% {
 transform: translateY(0px);
}

35% {
  background-color: gray;
 transform: translateY(10px);
}

45% {
 transform: translateY(0px);
}

60% {
 transform: translateY(-10px);
}

75% {
 transform: translateY(0px);
}

100% {
 transform: translateY(0px);
}
}

@keyframes typing2 {
  0% {
   transform: translateY(0px);
  }
  
  25% {
   transform: translateY(0px);
  }
  
  35% {
    color: gray;
   transform: translateY(10px);
  }
  
  45% {
   transform: translateY(0px);
  }
  
  60% {
   transform: translateY(-10px);
  }
  
  75% {
   transform: translateY(0px);
  }
  
  100% {
   transform: translateY(0px);
  }
  }
</style>