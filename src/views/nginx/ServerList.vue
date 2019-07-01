<template>
    <div>
        <el-card class="box-card">
            <div>
                <el-button @click="addServer" type="primary" icon="el-icon-plus" size="mini" style="float: left; margin-bottom: 10px;">新增</el-button>
            </div>
            <el-table :data="serverList" style="width: 100%" highlight-current-row @expand-change="expandSelect"
                      type='index'
                      :row-key='getRowKeys'
                      :expand-row-keys="expands"
                      :header-cell-style="{background: '#ecf5ff'}" size="small">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-card class="box-card">
                            <el-form ref="serverForm" label-width="85px" :inline="inline" :model="scope.row" size="mini">
                                <el-card class="box-card" style="margin-bottom: 10px">
                                    <el-form-item label="监听配置:" prop="domain">
                                        <el-input v-model="scope.row.name" placeholder="域名/IP"
                                                  style="width: 300px;"></el-input>
                                    </el-form-item>
                                    <el-form-item label="" prop="port">
                                        <el-input v-model="scope.row.port" placeholder="端口号"
                                                  style="width: 400px;"></el-input>
                                    </el-form-item>
                                    <div v-for="(param, i) in scope.row.params">
                                        <el-form-item label=" " prop="paramName">
                                            <el-select v-model="param.name" placeholder="请选择" style="width: 300px;">
                                                <el-option
                                                        v-for="item in paramOptions"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                    <span>{{ item.label }}</span>
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item prop="paramValue">
                                            <el-input v-model="param.value" placeholder="属性值"
                                                      style="width: 400px;"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <i class="el-icon-delete" style="width: 20px; cursor: pointer;"
                                               @click="deleteParam(scope.row, i)"></i>
                                        </el-form-item>
                                        <el-form-item>
                                            <i class="el-icon-plus" style="width: 20px; cursor: pointer;"
                                               @click="addParam(scope.row)" v-if="i == scope.row.params.length-1"></i>
                                            <div style="width: 20px;" v-if="i != scope.row.params.length-1"></div>
                                        </el-form-item>
                                    </div>
                                </el-card>

                                <el-card class="box-card" v-for="(location, index) in scope.row.locations">
                                    <el-form-item label="映射配置:" prop="location">
                                        <el-input v-model="location.path" placeholder=""
                                                  style="width: 300px;"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <i class="el-icon-delete" style="width: 20px; cursor: pointer;"
                                           @click="deleteLocation(scope.row, index)"></i>
                                    </el-form-item>
                                    <el-form-item>
                                        <i class="el-icon-plus" style="width: 20px; cursor: pointer;"
                                           @click="addLocation(scope.row)"
                                           v-if="index == scope.row.locations.length-1"></i>
                                        <div style="width: 20px;" v-if="index != scope.row.locations.length-1"></div>
                                    </el-form-item>
                                    <div v-for="(attr, index) in location.attrs">
                                        <el-form-item label=" " prop="attrName">
                                            <el-select v-model="attr.name" placeholder="请选择" style="width: 300px;">
                                                <el-option
                                                        v-for="item in attrOptions"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                    <span>{{ item.label }}</span>
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item prop="attrValue">
                                            <el-input v-model="attr.value" placeholder="属性值"
                                                      style="width: 400px;"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <i class="el-icon-delete" style="width: 20px; cursor: pointer;"
                                               @click="deleteAttribute(location, index)"></i>
                                        </el-form-item>
                                        <el-form-item>
                                            <i class="el-icon-plus" style="width: 20px; cursor: pointer;"
                                               @click="addAttribute(location)"
                                               v-if="index == location.attrs.length-1"></i>
                                            <div style="width: 20px;" v-if="index != location.attrs.length-1"></div>
                                        </el-form-item>
                                    </div>
                                </el-card>
                            </el-form>
                        </el-card>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="域名"></el-table-column>
                <el-table-column align="center" prop="port" label="端口"></el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-check" circle size="mini"
                                   @click="saveServer(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini"
                                   @click="deleteServer(scope.row, scope.$index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="负载列表" :visible.sync="dialogVisible">
            <upstream-list></upstream-list>
        </el-dialog>
    </div>
</template>

<script>

    const BASE_PATH = 'http://127.0.0.1:8889'

    export default {
        name: "ServerList",
        created() {
            this.fetchServerList()
        },
        data() {
            return {
                expands: [],
                getRowKeys(row) {
                    return row.id
                },
                inline: true,
                dialogVisible: false,
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
                attrOptions: [
                    {
                        value: "proxy_pass",
                        label: "proxy_pass"
                    },
                    {
                        value: "proxy_set_header",
                        label: "proxy_set_header"
                    },
                ],
                paramOptions: [
                    {
                        value: "proxy_pass",
                        label: "proxy_pass"
                    },
                    {
                        value: "proxy_set_header",
                        label: "proxy_set_header"
                    },
                ]
            }
        },
        methods: {
            expandSelect (row, expandedRows) {
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
            fetchServerList() {
                let url = BASE_PATH + "/server/list"
                this.$http.get(url).then(response => {
                    if (response.body.code == 1) {
                        this.serverList = response.body.data
                    }
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
            saveServer(data) {
                let url = BASE_PATH + "/server/save"
                this.$http.post(url, data).then(response => {
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
            deleteServer(data, index) {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = BASE_PATH + "/server/delete"
                    this.$http.post(url, data).then(response => {
                        if (response.body.code == 1) {
                            this.serverList.splice(index, 1)
                            this.$message({
                                type: 'success',
                                center: true,
                                message: "删除成功！"
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
                        type: 'info',
                        message: '系统异常！'
                    });
                });
            },
            addLocation(item) {
                let location = {
                    path: '',
                    attrs: [{
                        name: '',
                        value: ''
                    }]
                }

                item.locations.push(location)
            },
            deleteLocation(item, index) {
                item.locations.splice(index, 1)
            },
            addAttribute(location) {
                let attr = {
                    name: '',
                    value: ''
                }
                location.attrs.push(attr)
            },
            deleteAttribute(location, index) {
                location.attrs.splice(index, 1)
            },
            addParam(item) {
                let param = {
                    name: '',
                    value: ''
                }
                item.params.push(param)
            },
            deleteParam(item, index) {
                item.params.splice(index, 1)
            },
        }
    }
</script>

<style lang="scss">
    .el-table__expanded-cell[class*=cell] {
        padding: 5px;
    }

    .el-form-item {
        margin-bottom: 10px;
    }
</style>