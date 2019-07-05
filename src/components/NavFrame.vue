<template>
    <div>
        <el-tabs v-model="activeName" type="card" closable @tab-remove="removeTab" @tab-click="handleClick">
            <el-tab-pane
                    v-for="(item, index) in openedNavList"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
            >
                <section>
                    <keep-alive>
                        <router-view v-if="isCached"></router-view>
                    </keep-alive>
                    <router-view v-if="!isCached"></router-view>
                </section>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

    export default {
        name: "NavFrame",
        data() {
            return {
                openedNavList: [],
                activeName: '',
            }
        },
        props: {
            'activeNav': Object
        },
        created() {
        },
        computed: {
            isCached() {
                return typeof this.$route.meta.noCache === 'undefined' || this.$route.meta.noCache === false
            }
        },
        methods: {
            addTab(activeNav) {
                if (this.isNotOpened(activeNav)) {
                    this.openedNavList.push({
                        title: activeNav.title,
                        name: activeNav.name,
                        content: activeNav.name
                    });
                }
                this.activeName = activeNav.name;
                this.$router.push(this.activeName)
                console.log("add tab")
            },
            isNotOpened(activeNav) {
                let result = true;
                for (let i = 0; i < this.openedNavList.length; i++) {
                    if (activeNav.name == this.openedNavList[i].name) {
                        result = false;
                        break;
                    }
                }
                return result;
            },
            removeTab(targetName) {
                let tabs = this.openedNavList;
                let activeName = this.activeName;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.activeName = activeName;
                this.openedNavList = tabs.filter(tab => tab.name !== targetName);
                this.$router.push(this.activeName)
                console.log("remove tab")
            },
            handleClick(tab, event) {
                console.log("tab click")
                this.$router.push(tab.name)
            }
        }
    }
</script>

<style scoped>

</style>