<template>
    <div>
        <el-card class="box-card">
            <el-collapse v-model="activeName" accordion style="width: 700px; margin: 0 auto;">
                <el-collapse-item :title="item.name + ':' + item.port" :name="index" v-for="(item, index) in serverList"
                                  :key="index">
                    <el-card class="box-card">
                        <el-form label-width="80px" :inline="true" :model="item" size="mini">
                            <el-card class="box-card">
                                <el-form-item label="监听域名">
                                    <el-input v-model="item.name" placeholder="域名/IP" style="width: 240px;"></el-input>
                                </el-form-item>
                                <el-form-item label="">
                                    <el-input v-model="item.port" placeholder="端口号" style="width: 150px;"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <i class="el-icon-delete" style="width: 20px; cursor: pointer;"
                                       @click="deleteServer(index)"></i>
                                </el-form-item>
                                <el-form-item>
                                    <i class="el-icon-plus" style="width: 20px; cursor: pointer;"
                                       @click="addServer(index)" v-if="index == serverList.length-1"></i>
                                    <div style="width: 20px;" v-if="index != serverList.length-1"></div>
                                </el-form-item>
                                <div v-for="(param, i) in item.params">
                                    <el-form-item label=" ">
                                        <el-select v-model="param.name" placeholder="请选择" style="width: 150px;">
                                            <el-option
                                                    v-for="item in paramOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                <span>{{ item.label }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-input v-model="param.value" placeholder="属性值"
                                                  style="width: 240px;"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <i class="el-icon-delete" style="width: 20px; cursor: pointer;"
                                           @click="deleteParam(item, i)"></i>
                                    </el-form-item>
                                    <el-form-item>
                                        <i class="el-icon-plus" style="width: 20px; cursor: pointer;"
                                           @click="addParam(item)" v-if="i == item.params.length-1"></i>
                                        <div style="width: 20px;" v-if="i != item.params.length-1"></div>
                                    </el-form-item>
                                </div>

                                <el-card class="box-card" v-for="(location, index) in item.locations">
                                    <el-form-item label="Location">
                                        <el-input v-model="location.path" placeholder=""
                                                  style="width: 400px;"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <i class="el-icon-delete" style="width: 20px; cursor: pointer;"
                                           @click="deleteLocation(item, index)"></i>
                                    </el-form-item>
                                    <el-form-item>
                                        <i class="el-icon-plus" style="width: 20px; cursor: pointer;"
                                           @click="addLocation(item)" v-if="index == item.locations.length-1"></i>
                                        <div style="width: 20px;" v-if="index != item.locations.length-1"></div>
                                    </el-form-item>
                                    <div v-for="(attr, index) in location.attrs">
                                        <el-form-item label=" ">
                                            <el-select v-model="attr.name" placeholder="请选择" style="width: 150px;">
                                                <el-option
                                                        v-for="item in attrOptions"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                    <span>{{ item.label }}</span>
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-input v-model="attr.value" placeholder="属性值"
                                                      style="width: 240px;"></el-input>
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
                            </el-card>

                            <el-button @click="saveConfig(item)" round size="mini" type="primary"
                                       style="width: 460px; margin-top: 10px">保存
                            </el-button>
                        </el-form>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </el-card>
    </div>
</template>

<script>
    const BASE_PATH = 'http://127.0.0.1:8889'
    export default {
        name: "index",
        data() {
            return {
                activeName: 0,
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
        created() {
            this.fetchServerList()
        },
        methods: {
            fetchServerList() {
                let url = BASE_PATH + "/server/list"
                this.$http.get(url).then(response => {
                    this.serverList = response.body
                })
            },
            addServer(index) {
                let server = {
                    name: '127.0.0.1',
                    port: '808' + index,
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
                this.activeName = index + 1
            },
            deleteServer(index) {
                this.serverList.splice(index, 1)
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
            saveConfig(item) {
                let url = BASE_PATH + "/server/save"
                this.$http.post(url, item).then(response => {
                    this.$message.info("success")
                })
            }

        }
    }


</script>

<style scoped>
    .el-form-item {
        margin-bottom: 10px;
    }
</style>