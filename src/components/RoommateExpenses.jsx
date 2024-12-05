import { useState, useEffect } from 'react';
import {Plus, Archive, ChevronDown, ChevronUp, Trash2, Eye, Download, BarChart2} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/components/ui/use-toast.jsx';
import { DatabaseService } from '@/services/database';
import { useLanguage } from '@/contexts/language-context';
import ExpenseAnalytics from './ExpenseAnalytics';
import ReceiptManagement from './ReceiptManagement';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";

const RoommateExpenses = () => {
    const { t } = useLanguage();
    const [expenses, setExpenses] = useState([]);
    const [archivedMonths, setArchivedMonths] = useState([]);
    const [newExpense, setNewExpense] = useState({
        roommate: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [expandedMonth, setExpandedMonth] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [viewingExpense, setViewingExpense] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAnalytics, setShowAnalytics] = useState(false);

    const { toast } = useToast();
    const roommates = ['Görkem', 'Yiğit', 'Sertaç'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [expensesData, archivedData] = await Promise.all([
                DatabaseService.getAllExpenses(),
                DatabaseService.getAllArchivedMonths()
            ]);
            setExpenses(expensesData);
            setArchivedMonths(archivedData);
        } catch (error) {
            toast({
                title: t('errorLoading'),
                description: t('tryAgain'),
                variant: "destructive",
            });
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!newExpense.roommate || !newExpense.amount || !newExpense.description) return;

        try {
            const expenseToAdd = {
                roommate: newExpense.roommate,
                amount: parseFloat(newExpense.amount),
                description: newExpense.description,
                date: newExpense.date,
                receiptUrl: null  // Add this line to initialize receiptUrl
            };

            const addedExpense = await DatabaseService.addExpense(expenseToAdd);
            setExpenses(prev => [...prev, addedExpense]);

            setNewExpense({
                roommate: '',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });

            toast({
                title: t('expenseAdded'),
                description: expenseToAdd.description,
            });
        } catch (error) {
            console.error('Error adding expense:', error);
            toast({
                title: t('errorAdding'),
                description: t('tryAgain'),
                variant: "destructive",
            });
        }
    };


    const handleDeleteExpense = (expense) => {
        setExpenseToDelete(expense);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await DatabaseService.deleteExpense(expenseToDelete.id);
            setExpenses(prev => prev.filter(e => e.id !== expenseToDelete.id));
            setDeleteDialogOpen(false);
            setExpenseToDelete(null);

            toast({
                title: t('expenseDeleted'),
            });
        } catch (error) {
            toast({
                title: t('errorDeleting'),
                description: t('tryAgain'),
                variant: "destructive",
            });
            console.error('Error deleting expense:', error);
        }
    };

    const calculateSettlement = (expenseList) => {
        const total = expenseList.reduce((sum, exp) => sum + exp.amount, 0);
        const perPerson = total / 3;

        const spent = roommates.reduce((acc, roommate) => {
            acc[roommate] = expenseList
                .filter(exp => exp.roommate === roommate)
                .reduce((sum, exp) => sum + exp.amount, 0);
            return acc;
        }, {});

        const settlement = [];
        roommates.forEach(roommate => {
            const diff = spent[roommate] - perPerson;
            if (diff < 0) {
                roommates.forEach(other => {
                    if (spent[other] > perPerson) {
                        const amount = Math.min(Math.abs(diff), spent[other] - perPerson);
                        if (amount > 0) {
                            settlement.push({
                                from: roommate,
                                to: other,
                                amount: Math.round(amount * 100) / 100
                            });
                        }
                    }
                });
            }
        });

        return {
            total,
            perPerson,
            spent,
            settlement
        };
    };

    const exportToCSV = (data, filename) => {
        const expenses = data.expenses;
        const settlement = data.settlement.settlement;

        const expensesCSV = [
            ['Date', t('roommate'), t('description'), t('amount')],
            ...expenses.map(e => [
                new Date(e.date).toLocaleDateString(),
                `${t('roommate')} ${e.roommate}`,
                e.description,
                e.amount.toFixed(2)
            ])
        ];

        expensesCSV.push([]);
        expensesCSV.push([t('settlement')]);
        settlement.forEach(s => {
            expensesCSV.push([
                `${t('roommate')} ${s.from} ${t('owes')} ${t('roommate')} ${s.to}`,
                s.amount.toFixed(2)
            ]);
        });

        const csvContent = expensesCSV
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const endMonth = async () => {
        if (expenses.length === 0) return;

        try {
            const monthData = {
                expenses: expenses,
                settlement: calculateSettlement(expenses),
                month_date: new Date().toISOString().split('T')[0]
            };

            const archivedMonth = await DatabaseService.archiveMonth(monthData);
            setArchivedMonths(prev => [archivedMonth, ...prev]);
            setExpenses([]);

            toast({
                title: t('monthArchived'),
            });
        } catch (error) {
            toast({
                title: t('errorArchiving'),
                description: t('tryAgain'),
                variant: "destructive",
            });
            console.error('Error archiving month:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90"
                >
                    <BarChart2 size={16}/>
                    {showAnalytics ? t('hideAnalytics') : t('viewAnalytics')}
                </button>
            </div>

            {showAnalytics && (
                <ExpenseAnalytics
                    expenses={expenses}
                    archivedMonths={archivedMonths}
                />
            )}


            <Card>
                <CardHeader>
                    <CardTitle>{t('addExpense')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <select
                                className="p-2 border rounded bg-background"
                                value={newExpense.roommate}
                                onChange={(e) => setNewExpense({...newExpense, roommate: e.target.value})}
                            >
                                <option value="">{t('selectRoommate')}</option>
                                {roommates.map(r => (
                                    <option key={r} value={r}>{t('roommate')} {r}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                step="0.01"
                                placeholder={t('amount')}
                                className="p-2 border rounded bg-background"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder={t('description')}
                            className="w-full p-2 border rounded bg-background"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                            >
                                <Plus size={16}/> {t('addButton')}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('currentMonth')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {expenses.length > 0 ? (
                        <>
                            <div className="space-y-2">
                                {expenses.map(expense => (
                                    <div key={expense.id}
                                         className="flex justify-between items-center p-2 bg-muted rounded">
                                        <div>
                                            <span className="font-medium">{t('roommate')} {expense.roommate}</span>
                                            <span className="mx-2">-</span>
                                            <span>{expense.description}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">${expense.amount.toFixed(2)}</span>
                                            <button
                                                onClick={() => setViewingExpense(expense)}
                                                className="p-1 text-muted-foreground hover:text-foreground"
                                            >
                                                <Eye size={16}/>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteExpense(expense)}
                                                className="p-1 text-destructive hover:text-destructive/80"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <h3 className="font-medium mb-2">{t('settlement')}:</h3>
                                {calculateSettlement(expenses).settlement.map((s, i) => (
                                    <div key={i} className="text-sm">
                                        {t('roommate')} {s.from} {t('owes')} {t('roommate')} {s.to}:
                                        ${s.amount.toFixed(2)}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={endMonth}
                                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                                >
                                    <Archive size={16}/> {t('endMonth')}
                                </button>
                                <button
                                    onClick={() => exportToCSV({
                                        expenses,
                                        settlement: calculateSettlement(expenses)
                                    }, 'current-month-expenses.csv')}
                                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90"
                                >
                                    <Download size={16}/> {t('export')}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            {t('noExpenses')}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('previousMonths')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {archivedMonths.length > 0 ? (
                        <div className="space-y-4">
                            {archivedMonths.map((month, index) => (
                                <div key={index} className="border rounded p-4">
                                    <div className="flex justify-between items-center">
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => setExpandedMonth(expandedMonth === index ? null : index)}
                                        >
                                            <h3 className="font-medium">
                                                {new Date(month.month_date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => exportToCSV(month, `expenses-${month.month_date}.csv`)}
                                                className="flex items-center gap-1 text-primary hover:text-primary/80"
                                            >
                                                <Download size={16}/>
                                            </button>
                                            {expandedMonth === index ? <ChevronUp size={16}/> :
                                                <ChevronDown size={16}/>}
                                        </div>
                                    </div>

                                    {expandedMonth === index && (
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">{t('currentMonth')}:</h4>
                                                {month.expenses.map((expense, i) => (
                                                    <div key={i} className="flex justify-between text-sm py-1">
                                                        <span>{t('roommate')} {expense.roommate} - {expense.description}</span>
                                                        <span>${expense.amount.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <h4 className="font-medium mb-2">{t('settlement')}:</h4>
                                                {month.settlement.settlement.map((s, i) => (
                                                    <div key={i} className="text-sm">
                                                        {t('roommate')} {s.from} {t('owes')} {t('roommate')} {s.to}:
                                                        ${s.amount.toFixed(2)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            {t('noArchived')}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('delete')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('deleteConfirm')}
                            <br/>
                            {t('cannotUndo')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* View Expense Dialog */}
            <AlertDialog open={!!viewingExpense} onOpenChange={() => setViewingExpense(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('expenseDetails')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {viewingExpense && (
                                <div className="space-y-4 mt-2">
                                    <div className="space-y-2">
                                        <p><strong>{t('date')}:</strong> {new Date(viewingExpense.date).toLocaleDateString()}</p>
                                        <p><strong>{t('roommate')}:</strong> {viewingExpense.roommate}</p>
                                        <p><strong>{t('amount')}:</strong> ${viewingExpense.amount.toFixed(2)}</p>
                                        <p><strong>{t('description')}:</strong> {viewingExpense.description}</p>
                                    </div>

                                    {/* Receipt Management */}
                                    <div className="pt-4 border-t">
                                        <ReceiptManagement
                                            expenseId={viewingExpense.id}
                                            receiptUrl={viewingExpense.receiptUrl}
                                            onReceiptUpdate={async (url) => {
                                                await DatabaseService.updateReceiptUrl(viewingExpense.id, url);
                                                setViewingExpense(prev => ({
                                                    ...prev,
                                                    receiptUrl: url
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setViewingExpense(null)}>{t('close')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default RoommateExpenses;