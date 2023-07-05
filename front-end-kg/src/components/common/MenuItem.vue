<template>
    <div>
      <!--v-if="['00','10'].indexOf(menu.functionType) >= 0  && menu.status === '1'"-->
        <template v-for="(menu,idx) in menuList" v-if="['00','10'].indexOf(menu.functionType) >= 0  && menu.status === '1'">
            <el-submenu :index="menu.functionUrl+''" :key="idx" v-if="menu.children">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{menu.label}}</span>
                </template>
                <menu-item :menu-list="menu.children"></menu-item>
            </el-submenu>
            <el-menu-item :index="menu.functionUrl+''" :key="idx" v-else>
              <i class="el-icon-menu"></i>
              <span>{{menu.label}}</span>
            </el-menu-item>
        </template>
    </div>
</template>

<script>
    export default {
        name:'menuItem',
        data: function() {
            return {
                //menuItem:{}
            }
        },
        props:["menuList"],
        mounted(){
            //console.info('ergwegwegr   ',this.menuList);
        },
    }
</script>