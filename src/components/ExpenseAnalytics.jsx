import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, Line, Bar, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/language-context';

const ExpenseAnalytics = ({ expenses, archivedMonths }) => {
    const { t } = useLanguage();

    const monthlyTotals = useMemo(() => {
        const totals = new Map();

        // Current month expenses
        expenses.forEach(expense => {
            const monthYear = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            totals.set(monthYear, (totals.get(monthYear) || 0) + expense.amount);
        });

        // Archived months
        archivedMonths.forEach(month => {
            const monthYear = new Date(month.month_date).toLocaleString('default', { month: 'long', year: 'numeric' });
            const total = month.expenses.reduce((sum, exp) => sum + exp.amount, 0);
            totals.set(monthYear, total);
        });

        return Array.from(totals.entries()).map(([month, total]) => ({
            month,
            total
        })).sort((a, b) => new Date(a.month) - new Date(b.month));
    }, [expenses, archivedMonths]);

    const roommateSpending = useMemo(() => {
        const spending = {};

        // Initialize roommate totals
        ['Görkem', 'Yiğit', 'Sertaç'].forEach(roommate => {
            spending[roommate] = {
                name: roommate,
                current: 0,
                total: 0,
                average: 0,
                months: 0
            };
        });

        // Current month
        expenses.forEach(expense => {
            spending[expense.roommate].current += expense.amount;
            spending[expense.roommate].total += expense.amount;
        });

        // Archived months
        archivedMonths.forEach(month => {
            month.expenses.forEach(expense => {
                spending[expense.roommate].total += expense.amount;
            });
        });

        // Calculate averages
        const totalMonths = archivedMonths.length + (expenses.length > 0 ? 1 : 0);
        Object.values(spending).forEach(s => {
            s.months = totalMonths;
            s.average = totalMonths > 0 ? s.total / totalMonths : 0;
        });

        return Object.values(spending);
    }, [expenses, archivedMonths]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('monthlySpending')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyTotals}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="hsl(var(--primary))"
                                    name={t('totalExpenses')}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('roommateSpending')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={roommateSpending}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="current"
                                    fill="hsl(var(--primary))"
                                    name={t('currentMonth')}
                                />
                                <Bar
                                    dataKey="average"
                                    fill="hsl(var(--secondary))"
                                    name={t('monthlyAverage')}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roommateSpending.map(roommate => (
                    <Card key={roommate.name}>
                        <CardHeader>
                            <CardTitle>{roommate.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="text-sm text-muted-foreground">{t('currentMonth')}</dt>
                                    <dd className="text-2xl font-bold">${roommate.current.toFixed(2)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-muted-foreground">{t('monthlyAverage')}</dt>
                                    <dd className="text-2xl font-bold">${roommate.average.toFixed(2)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-muted-foreground">{t('totalSpent')}</dt>
                                    <dd className="text-2xl font-bold">${roommate.total.toFixed(2)}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ExpenseAnalytics;