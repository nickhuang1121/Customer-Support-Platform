import { UI } from "./ui.js";
import { subscribeAuthState } from "./auth.js";
import { fetchCases, createCase, fetchMessages, createMessage } from "./case.js"



let currentUser = null;
let cases = [];

subscribeAuthState(user => {
    currentUser = user;
    if (currentUser !== null) {
        //登入
        ui.loginBtnState(true);
    } else {
        //尚未登入
        ui.loginBtnState(false);
    }
})


async function handleCreateCase(data) {
    if (!currentUser) {
        //新增案件時，尚未登入
        ui.warning("請先登入Google帳號");
        return;
    }

    await createCase({
        uid: currentUser.uid,
        authorName: currentUser.displayName,
        ...data
    });
    ui.closeFixWindow();
    await loadCases();
}

async function handleLoadCaseDetail(caseId) {
    const selectedCase = cases.find(c => caseId == c.id);
    ui.renderCaseDetail(selectedCase);
    handleLoadMessages(caseId);
}


async function handleLoadMessages(caseId) {
    try {
        const messages = await fetchMessages(caseId);
        ui.renderMessages(caseId, messages);
    } catch (err) {
        console.error("載入留言失敗", err);
    }
}

async function handleCreateMessage(caseId, text, dept) {
    if (!currentUser) {
        ui.warning("請先登入Google帳號");
        return;
    }

    try {
        await createMessage({
            caseId,
            uid: currentUser.uid,
            authorName: currentUser.displayName,
            text,
            authorDept: dept
        });

        await handleLoadMessages(caseId);
    } catch (err) {
        console.error("新增留言失敗", err);
    }
}



const preRenderUI = {
    createCaseDeptOptionList: document.getElementById("createCaseDeptOptionList"),
}

const DEPT_META = {
    support: { label: "客服部", short: "客服", color: "#79a7f2" },
    it: { label: "資訊部", short: "資訊", color: "#5d89db" },
    marketing: { label: "行銷部", short: "行銷", color: "#f3a13b" },
    product: { label: "商品部", short: "商品", color: "#62c78a" },
    production: { label: "生產部", short: "生產", color: "#c4956a" },
    quality: { label: "品管部", short: "品管", color: "#a78bf2" },
    rd: { label: "研發部", short: "研發", color: "#e07fa0" }
}


const createRefs = {
    createCaseBtn: document.getElementById("createCaseBtn"),
    createMessageBtn: document.getElementById("createMessageBtn"),
    createMessageInput: document.getElementById("createMessageInput"),
    createMessageSelect: document.getElementById("createMessageSelect"),
    createCaseSerialBtn: document.getElementById("createCaseSerialBtn"),
    createCaseSerialOutputEl: document.getElementById("createCaseSerialOutput"),
    createCaseTitleInputEl: document.getElementById("createCaseTitleInput"),
    createCaseContentInputEl: document.getElementById("createCaseContentInput"),
    openCreateCasePanelBtn: document.getElementById("openCreateCasePanelBtn"),
    fixWindow: document.getElementById("fixWindow"),
    closeBtn: document.getElementById("closeBtn"),
    warningEl: document.getElementById("warning")
};

const detailOutputRefs = {
    detailTitleOutputEl: document.getElementById("caseDetailTitleOutput"),
    detailSerialOutputEl: document.getElementById("caseDetailSerialOutput"),
    detailContentOutputEl: document.getElementById("caseDetailContentOutput"),
    detailDeptOutputEl: document.getElementById("caseDetailDeptOutput"),
}

const authRefs = {
    googleLoginBtn: document.getElementById("loginWithGoogleBtn"),
    topLoginGoogleBtn: document.getElementById("topLoginGoogleBtn"),
    logoutBtn: document.getElementById("logoutBtn"),
    topLogoutBtn: document.getElementById("topLogoutBtn")
};

const listRefs = {
    caseListEl: document.getElementById("caseList"),
};

const threadRefs = {
    caseMessageThreadContainerEl: document.getElementById("caseMessageThreadContainer")
};

const handlers = {
    onCreateCase: handleCreateCase,
    onLoadCaseDetail: handleLoadCaseDetail,
    onCreateMessage: handleCreateMessage
};

const ui = new UI({
    preRenderUI,
    authRefs,
    listRefs,
    threadRefs,
    createRefs,
    handlers,
    detailOutputRefs,
    DEPT_META
});
ui.init();

async function loadCases() {
    cases = await fetchCases();
    ui.renderCaseLists(cases);
}

loadCases();










