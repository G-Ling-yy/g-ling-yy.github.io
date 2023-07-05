<template>
    <div class="area-select">
        <template v-if="show">
            <el-select
                key="pro"
                v-model="res.province"
                filterable
                clearable
                class="select"
                :disabled="disabled"
                placeholder="选择省份"
                @change="change($event, 1)"
            >
                <el-option v-for="item in provinceList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
            <el-select
                key="city"
                v-model="res.city"
                filterable
                clearable
                :disabled="disabled"
                class="select"
                no-data-text="请先选择省份"
                placeholder="选择城市"
                @change="change($event, 2)"
            >
                <el-option v-for="item in cityList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
            <el-select
                key="area"
                v-model="res.area"
                filterable
                clearable
                :disabled="disabled"
                class="select"
                no-data-text="请先选择城市"
                placeholder="选择区县"
                @change="change($event, 3)"
            >
                <el-option v-for="item in areaList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
        </template>

        <div v-else class="loading-mask">
            <template v-if="isError"> <i class="el-icon-warning" /> <span>发生了错误, 请联系管理员</span> </template>
            <template v-else> <i class="el-icon-loading" /><span>正在加载省市区数据,请稍后...</span> </template>
        </div>
    </div>
</template>

<script>
import service from '@/services/service';
export default {
    name: 'AreaSelect',
    props: ['value', 'disabled', 'config'],
    data() {
        return {
            isError: false,
            show: false,
            provinceList: [],
            cityList: [],
            areaList: [],
            res: {
                province: '',
                city: '',
                area: ''
            }
        };
    },
    watch: {
        res: {
            deep: true,
            handler(nv, ov) {
                this.$emit('input', nv);
            }
        },
        value: {
            deep: true,
            handler(nv, ov) {
                if (nv && !ov) {
                    this.assign();
                }
            }
        }
    },
    created() {
        if (window.$areaCodes) {
            this.setProvinceList();
        } else if (localStorage.getItem('$areaCodes')) {
            window.$areaCodes = JSON.parse(localStorage.getItem('$areaCodes'));
            this.setProvinceList();
        } else {
            let method = this.config.method || 'get';

            service[method](this.config.url, this.config.params, this.config.header)
                .then(({ data }) => {
                    const codes = data[0].children;
                    localStorage.setItem('$areaCodes', JSON.stringify(codes));
                    window.$areaCodes = codes;
                    this.setProvinceList();
                })
                .catch(e => {
                    this.isError = true;
                    this.$message.error('无法加载省市区数据,请联系管理员');
                });
        }
    },
    methods: {
        setProvinceList() {
            this.show = true;
            this.codes = window.$areaCodes;
            this.provinceList = this.codes.map(it => {
                return {
                    title: it.title,
                    id: it.id
                };
            });
            this.assign();
        },
        change(code, level) {
            if (level === 1) {
                if (code) {
                    this.cityList = this.codes.find(it => it.id === code).children;
                } else {
                    this.cityList = [];
                    this.res.city = '';
                }
            }

            if (level === 2) {
                if (code) {
                    this.areaList = this.cityList.find(it => it.id === code).children;
                } else {
                    this.areaList = [];
                    this.res.area = '';
                }
            }
        },
        formatToString(arg) {
            let res = arg;
            if (arg === null || arg === undefined || isNaN(arg)) {
                res = '';
            }
            if (typeof arg === 'number') {
                res = arg + '';
            }
            if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
                res = {};
                for (let key in arg) {
                    res[key] = this.formatToString(arg[key]);
                }
            }
            return res;
        },
        assign() {
            if (!this.value) {
                return;
            }
            const data = this.formatToString(this.value);
            const { province = '', city = '', area = '' } = data;
            this.res.province = province + '';
            this.res.city = city + '';
            this.res.area = area + '';

            if (province) {
                this.change(province, 1);
            }
            if (province && city) {
                this.change(city, 2);
            }
            // 仅有城市的情况下赋值
            if (!province && city) {
                const strCity = city + '';
                let hitNode = null;
                let parent = null;
                for (let i = 0; i < this.codes.length; i++) {
                    const provinceItem = this.codes[i];
                    if (provinceItem.children) {
                        for (let j = 0; j < provinceItem.children.length; j++) {
                            const cityItem = provinceItem.children[j];
                            if (cityItem.id === strCity) {
                                hitNode = cityItem;
                                break;
                            }
                        }
                    }
                    if (hitNode) {
                        parent = provinceItem;
                        break;
                    }
                }
                if (hitNode) {
                    this.res.province = hitNode.parentId;
                    this.cityList = parent.children;
                    this.areaList = hitNode.children;
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.area-select {
    display: flex;
    min-height: 40px;
    /*display: flex;*/
    .select + .select {
        margin-left: 10px;
    }
    .loading-mask {
        padding-left: 30px;
        .el-icon-loading,
        .el-icon-warning {
            margin-right: 10px;
        }
    }
}
</style>
