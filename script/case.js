import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    getDocs

} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";


export async function fetchCases() {
    const q = query(
        collection(db, "cases"),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const cases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return cases;
}

export async function createCase({ uid, authorName, caseSerial, caseTitle, caseContent, transferDepartments }) {
    await addDoc(collection(db, "cases"), {
        uid,
        authorName: authorName ?? "匿名",
        caseSerial,
        caseTitle,
        caseContent,
        transferDepartments,
        createdAt: serverTimestamp()
    });
}

export async function fetchMessages(caseId) {
    const q = query(
        collection(db, "cases", caseId, "messages"),
        orderBy("createdAt", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createMessage({ caseId, uid, authorName, text, authorDept }) {
    await addDoc(collection(db, "cases", caseId, "messages"), {
        uid,
        authorName: authorName ?? "匿名",
        text,
        authorDept,
        createdAt: serverTimestamp()
    });
}