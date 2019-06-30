<template>
    <div>
        <el-container style="border: 1px solid #eee">
            <el-header>
                <div>
                    <span style="line-height: 50px;">资源管理器</span>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu style="height: 600px"
                             :default-active="activeMenu"
                             @select="handleSelect"
                             background-color="#545c64"
                             text-color="#fff"
                             active-text-color="#ffd04b">
                        <NavMenu :navMenus="menuData"></NavMenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <nav-frame ref="NavFrame"></nav-frame>
                </el-main>
            </el-container>

        </el-container>

    </div>
</template>

<script>
    import NavFrame from "./NavFrame";
    import NavMenu from "./NavMenu";

    export default {
        name: "frame",
        components: {NavMenu, NavFrame},
        data() {
            return {
                activeMenu: '',
                menuData: [
                    {
                        entity: {
                            id: 0,
                            name: "nginx",
                            icon: "el-icon-message",
                            alias: "Nginx 配置",
                        },
                        childs: [
                            {
                                entity: {
                                    id: 1,
                                    name: "serverManage",
                                    icon: "el-icon-message",
                                    alias: "监听管理",
                                    path: "/serverManage"
                                }
                            },
                            {
                                entity: {
                                    id: 2,
                                    name: "upstreamManage",
                                    icon: "el-icon-bell",
                                    alias: "负载管理",
                                    path: "/upstreamManage"
                                }
                            }]
                    },
                ]
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                this.activeMenu = key
                let activeNav = searchMenu(this.menuData, key)
                this.$refs.NavFrame.addTab(activeNav)
            },
        }
    }

    function searchMenu(menuData, key) {
        for (let i = 0; i < menuData.length; i++) {
            let item = menuData[i]
            if (item.entity.path == null) {
                return searchMenu(item.childs, key)
            } else if (item.entity.name == key) {
                let activeNav = {}
                activeNav.name = item.entity.path
                activeNav.title = item.entity.alias
                return activeNav;
            }
        }
    }
</script>

<style scoped>
    .el-container {
        background-color: rgb(238, 241, 246);
    }

    .el-header {
        margin-bottom: 5px;
        height: 100px;
        border: 1px solid #eee;
        background-color: #fff;
    }

    .el-aside {
        margin-top: 5px;
        margin-right: 5px;
    }

    .el-main {
        margin: 5px;
        background-color: #fff;
    }

</style>