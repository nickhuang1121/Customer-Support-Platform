import {
    loginWithGoogle,
    logout
} from "./auth.js";
import { GenerateCaseSerial, FormatTime } from "./utils.js";
const generateCaseSerial = new GenerateCaseSerial();
const formatTime = new FormatTime();

export class UI {
    constructor({
        preRenderUI = {},
        authRefs = {},
        listRefs = {},
        threadRefs = {},
        createRefs = {},
        handlers = {},
        detailOutputRefs = {},
        DEPT_META = {}
    } = {}) {
        this.createCaseDeptOptionList = preRenderUI.createCaseDeptOptionList;

        this.googleLoginBtn = authRefs.googleLoginBtn ?? null;
        this.topLoginGoogleBtn = authRefs.topLoginGoogleBtn ?? null;
        this.logoutBtn = authRefs.logoutBtn ?? null;
        this.topLogoutBtn = authRefs.topLogoutBtn ?? null;

        this.caseListEl = listRefs.caseListEl ?? null;
        this.caseMessageThreadContainerEl = threadRefs.caseMessageThreadContainerEl ?? null;

        this.createCaseBtn = createRefs.createCaseBtn ?? null;
        this.createMessageBtn = createRefs.createMessageBtn ?? null;
        this.createMessageInput = createRefs.createMessageInput ?? null;
        this.createMessageSelect = createRefs.createMessageSelect ?? null;
        this.createCaseSerialBtn = createRefs.createCaseSerialBtn ?? null;
        this.createCaseSerialOutputEl = createRefs.createCaseSerialOutputEl ?? null;
        this.createCaseTitleInputEl = createRefs.createCaseTitleInputEl ?? null;
        this.createCaseContentInputEl = createRefs.createCaseContentInputEl ?? null;
        this.openCreateCasePanelBtn = createRefs.openCreateCasePanelBtn ?? null;
        this.fixWindow = createRefs.fixWindow ?? null;
        this.closeBtn = createRefs.closeBtn ?? null;
        this.warningEl = createRefs.warningEl ?? null;

        this.detailTitleOutputEl = detailOutputRefs.detailTitleOutputEl;
        this.detailSerialOutputEl = detailOutputRefs.detailSerialOutputEl;
        this.detailContentOutputEl = detailOutputRefs.detailContentOutputEl;
        this.detailDeptOutputEl = detailOutputRefs.detailDeptOutputEl;


        this.onCreateCase = handlers.onCreateCase ?? null;
        this.onLoadCaseDetail = handlers.onLoadCaseDetail ?? null;
        this.onCreateMessage = handlers.onCreateMessage ?? null;
        this.caseId = null;
        this.cases = [];

        this.DEPT_META = DEPT_META;
        this.closeWarningClock = null;
    }

    init() {
        this.preRenderUI();
        if (this.googleLoginBtn) {
            this.googleLoginBtn.addEventListener("click", () => this.handleGoogleLoginClick());
        }
        if (this.topLoginGoogleBtn) {
            this.topLoginGoogleBtn.addEventListener("click", () => this.handleGoogleLoginClick());
        }
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener("click", () => this.handleLogoutClick());
        }
        if (this.topLogoutBtn) {
            this.topLogoutBtn.addEventListener("click", () => this.handleLogoutClick());
        }
        if (this.createCaseBtn) {
            this.createCaseBtn.addEventListener("click", () => this.handleCreateCaseClick());
        }
        if (this.caseListEl) {
            this.bindCaseListEvents();
        }
        if (this.createMessageBtn) {
            this.createMessageBtn.addEventListener("click", () => this.handleCreateMessageSubmit());
        }

        if (this.createCaseSerialBtn) {
            this.createCaseSerialBtn.addEventListener("click", () => {
                this.createCaseSerialOutputEl.value = generateCaseSerial.generate()
            });
        }

        if (this.openCreateCasePanelBtn && this.closeBtn) {
            this.openCreateCasePanelBtn.addEventListener("click", () => {
                this.openFixWindow();
            })
            this.closeBtn.addEventListener("click", () => {
                this.closeFixWindow();
            })
        }
    }
    openFixWindow() {
        this.fixWindow.classList.add("action");
    }
    closeFixWindow() {
        this.fixWindow.classList.remove("action");
    }
    loginBtnState(isLogin) {
        if (isLogin) {
            this.topLoginGoogleBtn.classList.remove("visiable");
            this.topLogoutBtn.classList.add("visiable");
        } else {
            this.topLoginGoogleBtn.classList.add("visiable");
            this.topLogoutBtn.classList.remove("visiable");

        }





    }
    warning(str) {
        if (!this.warningEl) return;

        this.warningEl.innerText = str;

        if (this.closeWarningClock) {
            clearTimeout(this.closeWarningClock);
            this.closeWarningClock = null;
        }

        this.warningEl.classList.remove("visible");
        void this.warningEl.offsetWidth;
        this.warningEl.classList.add("visible");
        this.closeWarning();
    }

    closeWarning() {
        if (!this.warningEl) return;

        if (this.closeWarningClock) {
            clearTimeout(this.closeWarningClock);
        }

        this.closeWarningClock = setTimeout(() => {
            this.warningEl.classList.remove("visible");
            this.closeWarningClock = null;
        }, 3000);
    }
    preRenderUI() {
        this.renderDeptsCheckbox();

    }
    renderDeptsCheckbox() {
        const deptKeys = Object.keys(this.DEPT_META);
        deptKeys.forEach((engName) => {
            const chiName = this.getDeptChiName(engName);



            const li = document.createElement("li");
            li.classList.add("createCaseDeptOptionItem");
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("id", "dept-" + engName);
            checkbox.setAttribute("name", "createCaseDept");
            checkbox.setAttribute("value", engName);

            const label = document.createElement("label");
            label.setAttribute("for", "dept-" + engName);
            label.innerText = chiName;
            li.append(checkbox, label);

            this.createCaseDeptOptionList.append(li);
            this.renderDeptsSelect(engName, chiName)
        })
    }
    renderDeptsSelect(engName, chiName) {
        const option = document.createElement("option");
        option.value = engName;
        option.innerText = chiName;
        this.createMessageSelect.append(option);

    }
    selectFirstCase() {
        const firstLi = this.caseListEl?.querySelector("li[data-case-id]");
        if (!firstLi) return;
        firstLi.click();
    }
    bindCaseListEvents() {
        this.caseListEl.addEventListener("click", (event) => {
            const li = event.target.closest("li[data-case-id]");
            if (!li) return
            const caseId = li.getAttribute("data-case-id");
            this.caseId = caseId;
            this.onLoadCaseDetail?.(this.caseId);
            return
        });


    }
    handleCreateMessageSubmit() {
        if (!this.caseId) {
            this.warning("請先選擇案件");
            return
        }
        const dept = this.createMessageSelect.value;
        const text = this.createMessageInput.value.trim();
        this.onCreateMessage?.(this.caseId, text.trim(), dept);
        this.createMessageInput.value = "";
    }
    handleCreateCaseClick() {
        const selectedDepartments = this.getSelectedDepartments();
        const caseTitle = this.createCaseTitleInputEl?.value?.trim();
        if (!caseTitle) {
            this.warning("請輸入案件資訊");
            return
        };

        this.onCreateCase?.({
            caseSerial: this.createCaseSerialOutputEl?.value?.trim() ?? "",
            caseTitle,
            caseContent: this.createCaseContentInputEl?.value?.trim() ?? "",
            transferDepartments: selectedDepartments
        });

    }

    async handleGoogleLoginClick() {
        return loginWithGoogle();
    }

    async handleLogoutClick() {
        return logout();
    }

    renderCaseLists(cases) {

        this.caseListEl.innerHTML = "";
        cases.forEach((itemCase) => {
            this.renderCaseListItem(itemCase);
        });
        this.selectFirstCase();


    }

    renderCaseListItem(itemCase) {
        const li = document.createElement("li");
        const title = document.createElement("span");
        title.textContent = itemCase.caseTitle;
        title.classList.add("title");

        const serial = document.createElement("span");
        serial.textContent = itemCase.caseSerial;
        serial.classList.add("serial");


        li.setAttribute("data-case-id", itemCase.id);
        li.append(title, serial);
        this.caseListEl.append(li);
    }
    getDeptChiName(dept) {
        return this.DEPT_META[dept].label;
    }
    getDeptColor(dept) {
        return this.DEPT_META[dept].color;
    }
    renderDeptOutput(depts) {
        this.detailDeptOutputEl.innerHTML = "";
        depts.forEach(dept => {

            const span = document.createElement("span");
            span.classList.add("dept");
            span.innerText = this.getDeptChiName(dept);
            span.style.backgroundColor = this.getDeptColor(dept);
            this.detailDeptOutputEl.append(span);
        })

    }

    renderCaseDetail(caseDetail) {

        this.detailTitleOutputEl.textContent = caseDetail.caseTitle;
        this.detailSerialOutputEl.textContent = caseDetail.caseSerial;
        this.detailContentOutputEl.textContent = caseDetail.caseContent;
        if (caseDetail.transferDepartments !== undefined) {
            this.renderDeptOutput(caseDetail.transferDepartments);
        }
    }
    formatMessageTime(createdAt) {
        if (!createdAt || !createdAt.toDate) return "時間處理中";
        const date = createdAt.toDate();
        const now = new Date();

        return now;
    }

    renderMessages(caseId, messages) {

        this.caseMessageThreadContainerEl.innerHTML = "";
        messages.forEach((message) => {

            const li = document.createElement("li");

            const deptSpan = document.createElement("span");
            deptSpan.style.backgroundColor = this.getDeptColor(message.authorDept);
            let dept = "測試"
            if (message.authorDept !== undefined) {
                dept = this.getDeptChiName(message.authorDept);
            }
            deptSpan.classList.add("name");
            deptSpan.textContent = dept;

            const span = document.createElement("span");
            span.classList.add("time");
            span.textContent = "-回覆時間：" + formatTime.transfor(message.createdAt);

            li.append(deptSpan, message.text, span);
            this.caseMessageThreadContainerEl.append(li);
        });
    }

    getSelectedDepartments() {
        const departmentInputs = this.createCaseDeptOptionList?.querySelectorAll('input[name="createCaseDept"]')
            ?? [];

        return Array.from(departmentInputs)
            .filter((el) => el.checked)
            .map((el) => el.value);
    }

    createBtn(text, caseId, action) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.setAttribute("data-case-id", caseId);
        btn.setAttribute("data-action", action);
        return btn;
    }
}