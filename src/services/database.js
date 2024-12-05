import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const DatabaseService = {
    // Get all expenses
    async getAllExpenses() {
        const expensesRef = collection(db, 'expenses');
        const q = query(expensesRef, orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    // Add new expense
    async addExpense(expense) {
        const docRef = await addDoc(collection(db, 'expenses'), {
            ...expense,
            receiptUrl: null
        });
        return {
            id: docRef.id,
            ...expense,
            receiptUrl: null
        };
    },

    // Update receipt URL
    async updateReceiptUrl(expenseId, receiptUrl) {
        const expenseRef = doc(db, 'expenses', expenseId);
        await updateDoc(expenseRef, { receiptUrl });
    },

    // Delete expense
    async deleteExpense(id) {
        await deleteDoc(doc(db, 'expenses', id));
    },

    // Get all archived months
    async getAllArchivedMonths() {
        const archiveRef = collection(db, 'archived_months');
        const q = query(archiveRef, orderBy('month_date', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    // Archive a month
    async archiveMonth(monthData) {
        const docRef = await addDoc(collection(db, 'archived_months'), monthData);
        return {
            id: docRef.id,
            ...monthData
        };
    }
};