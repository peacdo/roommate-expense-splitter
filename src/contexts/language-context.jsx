import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        title: "Roommate Expense Splitter",
        addExpense: "Add New Expense",
        selectRoommate: "Select Roommate",
        amount: "Amount",
        description: "Description",
        addButton: "Add Expense",
        currentMonth: "Current Month Expenses",
        noExpenses: "No expenses recorded for this month yet.",
        previousMonths: "Previous Months",
        noArchived: "No archived months yet.",
        deleteConfirm: "Are you sure you want to delete this expense?",
        cannotUndo: "This action cannot be undone.",
        cancel: "Cancel",
        delete: "Delete",
        close: "Close",
        endMonth: "End Month",
        export: "Export",
        expenseDetails: "Expense Details",
        date: "Date",
        roommate: "",
        settlement: "Settlement Summary",
        loading: "Loading...",
        owes: "owes",
        total: "Total",
        perPerson: "Per Person",
        expenseDeleted: "Expense deleted successfully",
        expenseAdded: "Expense added successfully",
        monthArchived: "Month archived successfully",
        errorLoading: "Error loading data",
        errorAdding: "Error adding expense",
        errorDeleting: "Error deleting expense",
        errorArchiving: "Error archiving month",
        tryAgain: "Please try again later"
    },
    tr: {
        title: "Gider Paylaşımı",
        addExpense: "Yeni Gider Ekle",
        selectRoommate: "Kimsin",
        amount: "Tutar",
        description: "Açıklama",
        addButton: "Gider Ekle",
        currentMonth: "Bu Ayki Giderler",
        noExpenses: "Bu ay için henüz gider kaydı yok.",
        previousMonths: "Önceki Aylar",
        noArchived: "Henüz arşivlenmiş ay yok.",
        deleteConfirm: "Bu gideri silmek istediğinizden emin misiniz?",
        cannotUndo: "Bu işlem geri alınamaz.",
        cancel: "İptal",
        delete: "Sil",
        close: "Kapat",
        endMonth: "Ayı Bitir",
        export: "Dışa Aktar",
        expenseDetails: "Gider Detayları",
        date: "Tarih",
        roommate: "",
        settlement: "Hesaplaşma Özeti",
        loading: "Yükleniyor...",
        owes: "->",
        total: "Toplam",
        perPerson: "Kişi Başı",
        expenseDeleted: "Gider başarıyla silindi",
        expenseAdded: "Gider başarıyla eklendi",
        monthArchived: "Ay başarıyla arşivlendi",
        errorLoading: "Veri yüklenirken hata oluştu",
        errorAdding: "Gider eklenirken hata oluştu",
        errorDeleting: "Gider silinirken hata oluştu",
        errorArchiving: "Ay arşivlenirken hata oluştu",
        tryAgain: "Lütfen daha sonra tekrar deneyin"
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('language') || 'en';
        }
        return 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key) => translations[language]?.[key] || translations.en[key];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}