import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: '/index.html',
        animation: '/animation-demo.html',
        friendTierList: '/friend-tier-list.html',
        game: '/game.html',
        viniClicker: '/vini-clicker.html',
        viniClone: '/vini-clone.html',
        viniSoundboard: '/vini-soundboard.html',
        viniYeller: '/vini-yeller.html',
      },
    },
  },
})
