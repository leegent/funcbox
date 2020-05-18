<template>
    <transition name="fall">
        <div v-show="isShow" :class="'func-box-message alert alert-' + alertType">
            <i :class="'glyphicon glyphicon-' + iconType"></i>
            <span class="func-box-text">{{message}}</span>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        isShow: {
            type: Boolean,
            required: true
        },
        // 枚举值: success, info, warning, danger
        type: {
            type: String,
            default: 'success'
        },
        message: {
            type: String,
            required: true
        }
    },
    computed: {
        alertType() {
            if (this.type === 'success') {
                return 'info';
            }
            if (this.type === 'warning') {
                return 'danger';
            }
            return this.type;
        },
        iconType() {
            switch(this.type) {
                case 'success': 
                    return 'ok-circle';
                case 'info': 
                    return 'info-sign';
                case 'warning':
                    return 'warning-sign';
                case 'danger':
                    return 'exclamation-sign';
                default: 
                    return 'ok-circle';                
            }
        }
    },
    watch: {
        isShow(newVal) {
            if (newVal) {
                setTimeout(() => {
                    this.$emit('close');
                }, 2000);
            }
        }
    }
}
</script>

<style>
.func-box-message {
    position: fixed;
    transform: translateY(40px);
    left: 50%;
    width: 200px;
    margin-left: -100px;
    text-align: center;
}
.func-box-text {
    margin-left: 5px;
}
.fall-enter-active {
    transition: transform .2s linear;
}
.fall-enter {
    transform: translateY(0);
}
</style>