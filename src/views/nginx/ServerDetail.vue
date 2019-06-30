<template>
    <div>
        <el-card class="box-card">
            <el-form label-width="85px" :inline="inline" :model="serverDetail" size="mini">
                <el-card class="box-card" style="margin-bottom: 10px">
                    <el-form-item label="监听配置:">
                        <el-input v-model="serverDetail.name" placeholder="域名/IP" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="serverDetail.port" placeholder="端口号" style="width: 400px;"></el-input>
                    </el-form-item>
                    <div v-for="(param, i) in serverDetail.params">
                        <el-form-item label=" ">
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
                        <el-form-item>
                            <el-input v-model="param.value" placeholder="属性值"
                                      style="width: 400px;"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <i class="el-icon-delete" style="width: 20px; cursor: pointer;"
                               @click="deleteParam(serverDetail, i)"></i>
                        </el-form-item>
                        <el-form-item>
                            <i class="el-icon-plus" style="width: 20px; cursor: pointer;"
                               @click="addParam(serverDetail)" v-if="i == serverDetail.params.length-1"></i>
                            <div style="width: 20px;" v-if="i != serverDetail.params.length-1"></div>
                        </el-form-item>
                    </div>
                </el-card>

                <el-card class="box-card" v-for="(location, index) in serverDetail.locations">
                    <el-form-item label="映射配置:">
                        <el-input v-model="location.path" placeholder=""
                                  style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <i class="el-icon-delete" style="width: 20px; cursor: pointer;"
                           @click="deleteLocation(serverDetail, index)"></i>
                    </el-form-item>
                    <el-form-item>
                        <i class="el-icon-plus" style="width: 20px; cursor: pointer;"
                           @click="addLocation(serverDetail)" v-if="index == serverDetail.locations.length-1"></i>
                        <div style="width: 20px;" v-if="index != serverDetail.locations.length-1"></div>
                    </el-form-item>
                    <div v-for="(attr, index) in location.attrs">
                        <el-form-item label=" ">
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
                        <el-form-item>
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
    </div>
</template>

<script>
    const BASE_PATH = 'http://127.0.0.1:8889'
    export default {
        name: "ServerDetail",
        props: {
            serverDetail: {
                type: Object
            }
        },
        data() {
            return {
                inline: true,
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
            updateServerInfo() {
                let url = BASE_PATH + "/server/save"
                this.$http.post(url, this.serverDetail).then(response => {
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
            deleteServer() {
                let url = BASE_PATH + "/server/delete"
                this.$http.post(url, this.serverDetail).then(response => {
                    this.$message({
                        type: 'info',
                        center: true,
                        message: response.body.message
                    });
                })
            }
        }
    }


</script>

<style lang="scss">
    .el-form-item {
        margin-bottom: 10px;
    }
</style>