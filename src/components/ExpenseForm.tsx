import { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, PaymentMode } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { generateId, allExpenseCategories, allPaymentModes, getCategoryName, getPaymentModeName } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  expenseToEdit?: Expense;
  onCancel?: () => void;
}

const ExpenseForm = ({ onSubmit, expenseToEdit, onCancel }: ExpenseFormProps) => {
  const [amount, setAmount] = useState<string>(expenseToEdit ? expenseToEdit.amount.toString() : '');
  const [category, setCategory] = useState<ExpenseCategory>(expenseToEdit?.category || 'food');
  const [date, setDate] = useState<Date>(expenseToEdit ? new Date(expenseToEdit.date) : new Date());
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(expenseToEdit?.paymentMode || 'cash');
  const [payeeName, setPayeeName] = useState<string>(expenseToEdit?.payeeName || '');
  const [notes, setNotes] = useState<string>(expenseToEdit?.notes || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount.toString());
      setCategory(expenseToEdit.category);
      setDate(new Date(expenseToEdit.date));
      setPaymentMode(expenseToEdit.paymentMode);
      setPayeeName(expenseToEdit.payeeName);
      setNotes(expenseToEdit.notes || '');
    }
  }, [expenseToEdit]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!payeeName.trim()) {
      newErrors.payeeName = 'Please enter a payee name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const expenseData: Expense = {
      id: expenseToEdit ? expenseToEdit.id : generateId(),
      amount: Number(amount),
      category,
      date: date.toISOString(),
      paymentMode,
      payeeName,
      notes: notes.trim() || undefined,
    };
    
    onSubmit(expenseData);
    
    if (!expenseToEdit) {
      setAmount('');
      setCategory('food');
      setDate(new Date());
      setPaymentMode('cash');
      setPayeeName('');
      setNotes('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as ExpenseCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {allExpenseCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryName(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className={cn("w-full justify-start text-left font-normal")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  disabled={isFutureDate}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Method</Label>
            <Select value={paymentMode} onValueChange={(val) => setPaymentMode(val as PaymentMode)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {allPaymentModes.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {getPaymentModeName(mode)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payeeName">Payee Name</Label>
            <Input
              id="payeeName"
              placeholder="Enter payee name"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              className={errors.payeeName ? "border-red-500" : ""}
            />
            {errors.payeeName && <p className="text-red-500 text-sm">{errors.payeeName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this expense"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="w-full">
              {expenseToEdit ? 'Update' : 'Add'} Expense
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="w-full">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
