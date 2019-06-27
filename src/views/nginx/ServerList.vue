<template>
    <div>
        <el-card class="box-card">
            <div>
                <el-button @click="addServer" type="primary" icon="el-icon-plus" size="mini" style="float: left; margin-bottom: 10px;">新增</el-button>
            </div>
            <el-table :data="serverList" style="width: 100%" highlight-current-row :header-cell-style="{background: '#ecf5ff'}" size="small">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <server-detail :serverDetail="scope.row" ref="serverDetail"></server-detail>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="域名"></el-table-column>
                <el-table-column align="center" prop="port" label="端口"></el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-check" circle size="mini" @click="editServer('serverDetail' + scope.row.name + ':' + scope.row.port)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteServer(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>

    import ServerDetail from "./ServerDetail";

    const BASE_PATH = 'http://127.0.0.1:8889'

    export default {
        name: "ServerList",
        components: {ServerDetail},
        created() {
            this.fetchServerList()
        },
        data() {
            return {
                serverList: [
                    {
                        name: '',
                        port: '',
                        params: [{
                            name: '',
                            value: ''
                        }],
                        locations: [{
                            path: '',
                            attrs: [{
                                name: '',
                                value: ''
                            }]
                        }]
                    }
                ],
            }
        },
        methods: {
            editServer(ref) {
                this.$refs.serverDetail[1].updateServerInfo()
            },
            fetchServerList() {
                let url = BASE_PATH + "/server/list"
                this.$http.get(url).then(response => {
                    this.serverList = response.body
                })
            },
            addServer() {
                let server = {
                    name: '127.0.0.1',
                    port: '8080',
                    params: [{
                        name: '',
                        value: ''
                    }],
                    locations: [{
                        path: '',
                        attrs: [{
                            name: '',
                            value: ''
                        }]
                    }]
                }
                this.serverList.push(server)
            },
            deleteServer(row) {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ref = 'serverDetail' + row.name + ':' + row.port
                    this.serverList.splice(row.$index, 1)
                    this.$refs[ref].deleteServer()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '系统异常！'
                    });
                });
            },
        }
    }
</script>

<style lang="scss">
    .el-table__expanded-cell[class*=cell] {
        padding: 5px;
    }
</style>