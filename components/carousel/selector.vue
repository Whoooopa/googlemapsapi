<template>
    <div class="w-full h-72 bg-[rgb(150,110,20)] flex flex-row gap-4 justify-center items-center">
        <CardSelector
          v-for="menu in menus"
          :name="menu.name"
        />
    </div>
</template>

<script setup>
const menus = [
  {
  "name": "Map",
  },
  {
  "name": "Geoguessr",
  },
  {
  "name": "???",
  },
  
  
]
</script>