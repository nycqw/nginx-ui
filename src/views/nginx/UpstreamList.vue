<template>
    <div>
        <el-card class="box-card">
            <div>
                <el-button @click="addUpstream" type="primary" icon="el-icon-plus" size="mini"
                           style="float: left; margin-bottom: 10px;">新增
                </el-button>
            </div>

            <el-table ref="server" :data="upstreamList" style="width: 100%"
                      @expand-change="expandSelect"
                      type='index'
                      :row-key='getRowKeys'
                      :expand-row-keys="expands"
                      highlight-current-row :header-cell-style="{background: '#ecf5ff'}" size="small">
                <el-table-column label=" " width="30" >
                    <template scope="scope" >
                        <el-radio :label="scope.row.id" v-model="upstreamRadio" v-show="dialogVisible"
                                  @change.native="getSelectedUpstream(scope.row.name)">&nbsp
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-card class="box-card">
                            <el-form label-width="85px" :inline="inline" :model="scope.row" size="mini">
                                <div>
                                    <el-form-item label="名称:">
                                        <el-input v-model="scope.row.name" style="width: 300px;"></el-input>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item label="描述:">
                                        <el-input v-model="scope.row.description" style="width: 300px;"></el-input>
                                    </el-form-item>
                                </div>
                                <div v-for="(serverAddress, index) in scope.row.serverAddressList">
                                    <el-form-item label=" ">
                                        <el-input v-model="serverAddress.name" placeholder="节点地址"
                                                  style="width: 300px;"></el-input>
                                    </el-form-item>
                                    <el-form-item label="">
                                        <el-input v-model="serverAddress.port" placeholder="端口"
                                                  style="width: 100px;"></el-input>
                                    </el-form-item>
                                    <el-form-item label="">
                                        <el-input v-model="serverAddress.weight" placeholder="权重"
                                                  style="width: 100px;"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <i class="el-icon-delete" style="width: 20px; cursor: pointer;"
                                           @click="deleteServerAddress(scope.row, index)"></i>
                                    </el-form-item>
                                    <el-form-item>
                                        <i class="el-icon-plus" style="width: 20px; cursor: pointer;"
                                           @click="addServerAddress(scope.row)"
                                           v-if="index == scope.row.serverAddressList.length-1"></i>
                                        <div style="width: 20px;"
                                             v-if="index != scope.row.serverAddressList.length-1"></div>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </el-card>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="名称"></el-table-column>
                <el-table-column align="center" prop="port" label="描述"></el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-check" circle size="mini"
                                   @click="saveUpstream(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini"
                                   @click="deleteUpstream(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>

    </div>

</template>

<script>
    const BASE_PATH = 'http://127.0.0.1:8889'

    export default {
        name: "UpstreamList",
        data() {
            return {
                upstreamList: [{
                    name: '',
                    description: '',
                    serverAddressList: [{
                        name: '',
                        port: 80,
                        weight: 1
                    }]
                }],
                inline: true,
                expands: [],
                selectedUpstream: '',
                upstreamRadio: 1,
                getRowKeys(row) {
                    return row.id
                },
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        created() {
            this.fetchUpstreamList()
        },
        methods: {
            getSelectedUpstream(name) {
                this.selectedUpstream = name
            },
            addUpstream() {
                let upstream = {
                    id: this.upstreamList.length + 1,
                    name: '',
                    description: '',
                    serverAddressList: [{
                        name: '',
                        port: 80,
                        weight: 1
                    }]
                }
                this.upstreamList.push(upstream)
            },
            deleteServerAddress(item, index) {
                item.serverAddressList.splice(index, 1)
            },
            addServerAddress(item) {
                let serverAddress = {
                    name: '',
                    port: 80,
                    weight: 1
                }
                item.serverAddressList.push(serverAddress)
            },
            fetchUpstreamList() {
                let url = BASE_PATH + "/upstream/list"
                this.$http.get(url).then(response => {
                    if (response.body.code == 1) {
                        this.upstreamList = response.body.data
                    } else {
                        this.$message({
                            type: 'error',
                            center: true,
                            message: response.body.message
                        });
                    }
                })
            },
            saveUpstream(item) {
                let url = BASE_PATH + "/upstream/save"
                this.$http.post(url, item).then(response => {
                    if (response.body.code == 1) {
                        this.$message({
                            type: 'success',
                            center: true,
                            message: "保存成功！"
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            center: true,
                            message: response.body.message
                        });
                    }
                })
            },
            deleteUpstream(row) {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = BASE_PATH + "/upstream/delete"
                    this.$http.post(url, row).then(response => {
                        if (response.body.code == 1) {
                            this.upstreamList.splice(row.$index, 1)
                            this.$message({
                                type: 'success',
                                center: true,
                                message: '删除成功!'
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                center: true,
                                message: response.body.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'error',
                        center: true,
                        message: '系统异常！'
                    });
                });
            },
            expandSelect(row, expandedRows) {
                var that = this
                if (expandedRows.length) {
                    that.expands = []
                    if (row) {
                        that.expands.push(row.id)
                    }
                } else {
                    that.expands = []
                }
            },
        }
    }
</script>

<style scoped>

</style>