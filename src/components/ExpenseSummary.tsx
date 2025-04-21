
import { Expense, ExpenseCategory, ExpenseSummary as ExpenseSummaryType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getCategoryName, getCategoryColor, allExpenseCategories } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

const ExpenseSummary = ({ expenses }: ExpenseSummaryProps) => {
  // Calculate total amount
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate amount per category
  const categoryData = allExpenseCategories.map(category => {
    const amount = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      name: getCategoryName(category),
      value: amount,
      color: getCategoryColor(category),
      category
    };
  }).filter(item => item.value > 0);

  // Sort by amount descending
  categoryData.sort((a, b) => b.value - a.value);
  
  // Find the top 3 expenses
  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Expense Overview</CardTitle>
          <CardDescription>Summary of your spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-4xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>

            {categoryData.length > 0 && (
              <div className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                      }}
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      formatter={(value) => {
                        return <span className="text-xs">{value}</span>;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Detailed category breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">By Category</h3>
              <div className="space-y-2">
                {categoryData.map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span>{category.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-medium">{formatCurrency(category.value)}</span>
                      <span className="text-xs text-muted-foreground">
                        {totalAmount > 0 ? Math.round((category.value / totalAmount) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {topExpenses.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Top Expenses</h3>
                <div className="space-y-2">
                  {topExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span>{expense.payeeName}</span>
                        <span className="text-xs text-muted-foreground">{getCategoryName(expense.category)}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(expense.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummary;
