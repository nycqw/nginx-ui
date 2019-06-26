<template>
    <div id="app">
        <MainFrame></MainFrame>
    </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue'
    import MainFrame from './components/MainFrame.vue'

    export default {
        name: 'app',
        components: {
            MainFrame,
            HelloWorld
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
