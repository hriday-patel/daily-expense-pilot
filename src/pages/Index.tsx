
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseSummary from '@/components/ExpenseSummary';
import { Expense } from '@/types';
import { saveExpensesToLocalStorage, loadExpensesFromLocalStorage } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('summary');
  const { toast } = useToast();

  // Load expenses from local storage on initial render
  useEffect(() => {
    const savedExpenses = loadExpensesFromLocalStorage();
    setExpenses(savedExpenses);
  }, []);

  // Handle adding or updating an expense
  const handleExpenseSubmit = (expenseData: Expense) => {
    if (expenseToEdit) {
      // Update existing expense
      const updatedExpenses = expenses.map(expense => 
        expense.id === expenseData.id ? expenseData : expense
      );
      setExpenses(updatedExpenses);
      saveExpensesToLocalStorage(updatedExpenses);
      setExpenseToEdit(undefined);
      
      toast({
        title: "Expense updated",
        description: "Your expense has been updated successfully."
      });
    } else {
      // Add new expense
      const newExpenses = [...expenses, expenseData];
      setExpenses(newExpenses);
      saveExpensesToLocalStorage(newExpenses);
      
      toast({
        title: "Expense added",
        description: "Your expense has been added successfully."
      });
    }
    
    // Switch to history tab after adding/editing
    setActiveTab('history');
  };

  // Handle editing an expense
  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setActiveTab('add');
  };

  // Handle deleting an expense
  const handleDeleteExpense = (expenseId: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
    setExpenses(updatedExpenses);
    saveExpensesToLocalStorage(updatedExpenses);
    
    toast({
      title: "Expense deleted",
      description: "Your expense has been deleted successfully."
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="add">
                {expenseToEdit ? 'Edit' : 'Add'} Expense
              </TabsTrigger>
            </TabsList>
            
            {activeTab !== 'add' && (
              <Button onClick={() => {
                setExpenseToEdit(undefined);
                setActiveTab('add');
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            )}
          </div>

          <TabsContent value="summary" className="space-y-6">
            <ExpenseSummary expenses={expenses} />
          </TabsContent>

          <TabsContent value="history">
            <ExpenseList 
              expenses={expenses} 
              onEdit={handleEditExpense} 
              onDelete={handleDeleteExpense} 
            />
          </TabsContent>

          <TabsContent value="add">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
              </h2>
            </div>
            
            <ExpenseForm 
              onSubmit={handleExpenseSubmit} 
              expenseToEdit={expenseToEdit}
              onCancel={expenseToEdit ? () => {
                setExpenseToEdit(undefined);
                setActiveTab('history');
              } : undefined}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
