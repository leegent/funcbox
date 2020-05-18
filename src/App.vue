<template>
    <div id="app">
        <aside>
            <div class="func-box-title">函数箱</div>
            <section class="func-item" v-for="(func, idx) in funcList" :key="idx">
                <div class="func-name" @click="setCurent(idx)">{{func.name || '(待命名代码段)'}}</div>
                <div class="del-func-icon" @click="deleteFunc(idx)">
                    <span class="glyphicon glyphicon-minus"></span>
                </div>
            </section>
            <section class="func-item add-func-btn" @click="createFunc">+</section>
        </aside>
        <main v-if="current > -1">
            <header>
                <input
                    class="func-name-input"
                    placeholder="请输入代码段名称"
                    :value="currentEditingName"
                    @input="onInputFuncName"
                >
            </header>
            <section>
                <codemirror class="my-code-mirror" v-model="currentEditingCode" :options="cmOptions"></codemirror>
                <div class="op-area">
                    <button class="btn btn-primary" title="快捷键：Ctrl/Cmd + R" @click="runCode">
                        <span class="glyphicon glyphicon-play"></span>
                        运行代码
                    </button>
                    <button id="copy-btn" data-clipboard-target="#output" class="btn btn-primary" @click="copyOutput">
                        <span class="glyphicon glyphicon-copy"></span>
                        拷贝输出
                    </button>
                    <button class="btn btn-primary" @click="clearOutput">
                        <span class="glyphicon glyphicon-ban-circle"></span>
                        清空输出
                    </button>
                    <button class="btn btn-primary" @click="save" title="快捷键：Ctrl/Cmd + S">
                        <span class="glyphicon glyphicon-floppy-disk"></span>
                        保存
                    </button>
                    <button class="btn btn-primary" @click="switchStyle">
                        <span class="glyphicon glyphicon-leaf"></span>
                        切换主题
                    </button>
                    <span>当前主题: {{THEME_LIST[currentTheme]}}</span>
                </div>
            </section>
            <div id="output" class="output-area">{{currentOutput}}</div>
        </main>
        <div v-else class="empty-status">
            点击右侧加号按钮，创造你的第一个函数工具吧!
        </div>
        <message
            :isShow="!!msgType"
            :type="msgType"
            :message="msg"
            @close="msgType = ''"
        >
        </message>
    </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import Message from './components/message';

const FUNC_STORAGE_KEY = 'myDearFuncs';
const THEME_LIST = [
    'material',
    'hopscotch',
    'mdn-like',
    'solarized'
];

export default {
    name: "App",
    components: {
        Message
    },
    data() {
        return {
            THEME_LIST,
            currentTheme: 0,
            cmOptions: {
                tabSize: 4,
                mode: 'text/javascript',
                theme: THEME_LIST[0],
                lineNumbers: true,
                line: true,
            },
            funcList: [],
            current: -1,
            currentEditingName: '',
            currentEditingCode: '',
            currentOutput: '',
            msgType: '',
            msg: ''
        };
    },
    created() {
        const funcStorage = localStorage.getItem(FUNC_STORAGE_KEY);
        if (funcStorage) {
            const obj = JSON.parse(funcStorage);
            this.currentTheme = obj.theme || 0;
            this.cmOptions.theme = THEME_LIST[this.currentTheme];
            this.funcList = obj.funcList;
            if (this.funcList.length > 0) {
                this.setCurent(0);
            }
        }
    },
    mounted() {
        new ClipboardJS('#copy-btn');
        const isMac = window.navigator.userAgent.includes('Macintosh');
        // 自定义快捷键
        document.addEventListener('keydown', e => {
            const hasCtrl = ((isMac && e.metaKey) || (!isMac && e.ctrlKey));
            if (hasCtrl) {
                // cmd/ctrl + s 保存
                if (e.keyCode === 83) {
                    this.save();
                    e.preventDefault();
                }
                // cmd/ctrl + r 运行
                else if (e.keyCode === 82) {
                    this.runCode();
                    e.preventDefault();
                }
            }
        });
    },
    methods: {
        setCurent(idx) {
            this.current = idx;
            this.currentEditingName = this.funcList[idx].name;
            this.currentEditingCode = this.funcList[idx].code;
            this.currentOutput = '';
        },
        runCode() {
            try {
                this.currentOutput = eval(this.currentEditingCode);
            } catch (error) {
                console.error(error);
                alert(error.message)
            }
        },
        clearOutput() {
            this.currentOutput = '';
        },
        copyOutput() {
            if (this.currentOutput === '') {
                this.toast('warning', '当前无输出内容');
            } else {
                this.toast('success', '输出已复制到剪贴板');
            }
        },
        save() {
            let funcObj = Object.assign({}, this.funcList[this.current]);
            funcObj.name = this.currentEditingName;
            funcObj.code = this.currentEditingCode;
            this.funcList.splice(this.current, 1, funcObj);
            localStorage.setItem(FUNC_STORAGE_KEY, JSON.stringify({
                    theme: this.currentTheme,
                    funcList: this.funcList
                })
            );
            this.toast('success', '保存成功！');
        },
        onInputFuncName(e) {
            this.currentEditingName = e.target.value;
        },
        createFunc() {
            const funcObj = {
                name: '',
                code: ''
            };
            this.funcList.push(funcObj);
            this.setCurent(this.funcList.length - 1)
        },
        deleteFunc(idx) {
            const isConfirmed = window.confirm(`真的要删除“${this.funcList[this.current].name}”？`);
            if (isConfirmed) {
                this.funcList.splice(idx, 1);
                const isDeletingCurrent = idx === this.current;
                if (idx <= this.current) {
                    --this.current;
                }
                if (isDeletingCurrent) {
                    this.setCurent(this.current);
                }
            }
        },
        switchStyle() {
            ++this.currentTheme;
            if (this.currentTheme >= THEME_LIST.length) {
                this.currentTheme = 0;
            }
            this.cmOptions.theme = THEME_LIST[this.currentTheme];
        },
        toast(msgType, msg) {
            this.msgType = msgType;
            this.msg = msg;
        }
    }
};
</script>

<style>
html, body {
    margin: 0;
    padding: 0;
}
#app {
    min-height: 100vh;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: #2c3e50;
    display: flex;
    align-items: stretch;
    background-color: #f7eedf;
    color: #333;
}
aside {
    flex-shrink: 0;
    width: 200px;
    border-right: 2px solid #999;
}
.func-box-title {
    margin: 15px 0;
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 24px;
    font-weight: 700;
}
.func-item {
    box-sizing: border-box;
    padding: 10px 0;
    height: 50px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #333;
    cursor: pointer;
    line-height: 30px;
    display: flex;
    align-items: stretch;
}
.func-item:first-of-type {
    border-top: 1px solid #333;
}

.func-item:hover {
    background-color: #d3d3d3;
}
.func-name {
    padding-left: 10px;
    flex: 1;
    font-size: 14px;
}
.del-func-icon {
    flex-shrink: 0;
    width: 30px;
    text-align: center;
    font-weight: 700;
    font-size: 18px;
}
.add-func-btn {
    display: block;
    padding: 0;
    text-align: center;
    font-size: 36px;
    line-height: 50px;
}

main {
    box-sizing: border-box;
    width: 100%;
    flex: 1;
    padding: 20px 50px;
}
.empty-status {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 700;
}
header {
    height: 50px;
}
.func-name-input {
    width: 190px;
    outline: none;
    border: none;
    background-color: transparent;
    font-family: PingfangSC-Regular, sans-serif;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    border-bottom: 2px solid transparent;
}
.my-code-mirror {
    max-width: calc(100vw - 300px);
}
.op-area {
    margin: 20px 0;
}
.op-area button {
    margin: 0 10px;
    outline: none;
}
.op-area button:first-of-type {
    margin-left: 0;
}
.output-area {
    word-break: break-all;
    white-space: pre-wrap;
    font-size: 14px;
    min-height: 100px;
    padding: 20px;
    background: #fff;
}
</style>
