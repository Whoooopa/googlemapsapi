<template>
    <div class="absolute w-screen h-screen bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
        <div class="w-80 h-56 bg-white shadow-lg rounded-md flex flex-col justify-center gap-10">
            <div class="flex justify-center items-center">
                You have unfinished game
                <br>
                What do you want to do ?
            </div>
            <div class="flex flex-row gap-4 justify-center items-center">
                <button class="rounded-md bg-purple-300 px-4 py-1 shadow-md mt-3" @click="$emit('confirmation','New Game')">New Game</button>
                <button class="rounded-md bg-purple-300 px-4 py-1 shadow-md mt-3" @click="$emit('confirmation','Continue')">Continue</button>
            </div>
        </div>
    </div>
</template>
<script setup>
const emit = defineEmits(['confirmation']);
</script>