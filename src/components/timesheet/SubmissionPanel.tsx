import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Send, Save, AlertTriangle, X, Building2, User, Calendar, TrendingUp } from 'lucide-react';

interface SubmissionPanelProps {
  totalHours: number;
  pendingHours: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  onSubmit: () => void;
  onSaveDraft: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionPanel: React.FC<SubmissionPanelProps> = ({
  totalHours,
  pendingHours,
  status,
  onSubmit,
  onSaveDraft,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const canSubmit = pendingHours <= 0;
  const progressPercentage = Math.min((totalHours / 8) * 100, 100);

  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
          message: 'Your timesheet has been approved by your manager.',
          bgColor: 'bg-emerald-50'
        };
      case 'pending':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Clock className="h-5 w-5 text-blue-600" />,
          message: 'Your timesheet is pending manager approval.',
          bgColor: 'bg-blue-50'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
          message: 'Your timesheet was rejected. Please review and resubmit.',
          bgColor: 'bg-red-50'
        };
      default:
        return {
          color: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: <Save className="h-5 w-5 text-slate-600" />,
          message: 'Review your timesheet and submit when ready.',
          bgColor: 'bg-slate-50'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Send className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Submit to Enterprise</h2>
                <p className="text-blue-100">Final review and submission</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-1">{totalHours.toFixed(1)}h</div>
                <div className="text-sm text-blue-700">Total Logged</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-900 mb-1">8.0h</div>
                <div className="text-sm text-green-700">Required</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-white rounded-lg">
                    {statusConfig.icon}
                  </div>
                </div>
                <Badge className={`${statusConfig.color} text-sm px-3 py-1`}>
                  <span className="capitalize font-medium">{status}</span>
                </Badge>
                <div className="text-sm text-purple-700 mt-1">Status</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Completion Progress</h3>
                <span className="text-2xl font-bold text-blue-600">{progressPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0h</span>
                <span className="font-medium">Target: 8h</span>
                <span>8h</span>
              </div>
            </CardContent>
          </Card>

          {/* Status Message */}
          <Alert className={`border-2 ${statusConfig.color.replace('bg-', 'border-').replace('text-', 'bg-')}`}>
            <div className="flex items-center gap-3">
              {statusConfig.icon}
              <AlertDescription className="text-base font-medium">
                {statusConfig.message}
              </AlertDescription>
            </div>
          </Alert>

          {/* Validation Warnings */}
          {!canSubmit && (
            <Alert className="border-2 border-amber-300 bg-amber-50">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800 font-medium">
                <div className="mb-2">Unable to submit - missing requirements:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Minimum 8 hours required (shortage: {pendingHours.toFixed(1)} hours)</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Submission Summary */}
          <Card className="border-0 shadow-lg bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Building2 className="h-5 w-5" />
                Submission Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Employee</div>
                    <div className="font-medium">John Doe</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">{new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 mb-2">
                  By submitting, you confirm that all logged time is accurate and complies with company policies.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={onSubmit}
              disabled={!canSubmit || status === 'pending' || status === 'approved'}
              className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 shadow-lg"
            >
              <Send className="h-5 w-5 mr-2" />
              Submit to Enterprise
            </Button>
            
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={status === 'approved'}
              className="px-8 h-14 text-lg font-semibold border-2 hover:bg-gray-50"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Draft
            </Button>
          </div>

          {/* Manager Comments for Rejected Status */}
          {status === 'rejected' && (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Manager Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <p className="text-red-700">
                    Please provide more detailed justification for the idle time entries and ensure all tasks are properly linked to tickets.
                  </p>
                  <div className="mt-3 text-sm text-red-600">
                    Rejected by: Sarah Manager • {new Date().toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
