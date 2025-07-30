import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, CheckCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActivityTable } from '@/components/timesheet/ActivityTable';
import { ManualTimeEntry } from '@/components/timesheet/ManualTimeEntry';
import { ActivityAssociationPanel } from '@/components/timesheet/ActivityAssociationPanel';
import { SubmissionPanel } from '@/components/timesheet/SubmissionPanel';
import CompactConfirmationDialog from '@/components/timesheet/CompactConfirmationDialog';

interface Activity {
  id: string;
  name: string;
  date: string;
  duration: number;
  isAssociated: boolean;
  associationType?: "Task" | "Meeting" | "Break" | "Idle";
  ticketId?: string;
}

const Timesheet = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAssociationPanel, setShowAssociationPanel] = useState(false);
  const [showSubmissionPanel, setShowSubmissionPanel] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      name: 'Visual Studio Code',
      date: '2024-01-15',
      duration: 120,
      isAssociated: false,
    },
    {
      id: '2',
      name: 'Chrome Browser',
      date: '2024-01-15',
      duration: 90,
      isAssociated: true,
      associationType: 'Task' as const,
      ticketId: 'TASK-001',
    },
    {
      id: '3',
      name: 'Slack',
      date: '2024-01-15',
      duration: 30,
      isAssociated: false,
    },
  ]);
  const [manualEntries, setManualEntries] = useState([]);

  const handleSubmitTimesheet = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSubmission = () => {
    console.log('Timesheet submitted');
    setShowConfirmation(false);
    // Add actual submission logic here
  };

  const handleAssociateActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowAssociationPanel(true);
  };

  const handleSaveAssociation = (activityId: string, data: any) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, isAssociated: true, ...data }
        : activity
    ));
    setShowAssociationPanel(false);
  };

  const handleAddManualEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setManualEntries(prev => [...prev, newEntry]);
  };

  const totalHours = activities.reduce((sum, activity) => sum + activity.duration, 0) / 60;
  const pendingHours = Math.max(8 - totalHours, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Timesheet</span>
          </nav>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Timesheet Management</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Select Period</span>
              <span className="sm:hidden">Period</span>
            </Button>
            <Button onClick={() => setShowSubmissionPanel(true)} variant="outline" size="sm" className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Review & Submit</span>
              <span className="lg:hidden">Review</span>
            </Button>
            <Button onClick={handleSubmitTimesheet} size="sm" className="w-full sm:w-auto">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Quick Submit</span>
              <span className="lg:hidden">Submit</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32.0</div>
              <p className="text-xs text-muted-foreground">79% billable</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activities.length}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Draft</div>
              <p className="text-xs text-muted-foreground">Not submitted</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <ActivityTable activities={activities} onAssociate={handleAssociateActivity} />
          <ManualTimeEntry 
            onAddEntry={handleAddManualEntry}
            entries={manualEntries}
            pendingHours={pendingHours}
          />
        </div>
      </div>

      <CompactConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="Submit Timesheet"
        description="Are you sure you want to submit your timesheet? Once submitted, you won't be able to make changes."
        onConfirm={handleConfirmSubmission}
      />

      {showAssociationPanel && selectedActivity && (
        <ActivityAssociationPanel
          activity={selectedActivity}
          onSave={handleSaveAssociation}
          onClose={() => setShowAssociationPanel(false)}
        />
      )}

      {showSubmissionPanel && (
        <SubmissionPanel
          totalHours={totalHours}
          pendingHours={pendingHours}
          status="draft"
          onSubmit={handleSubmitTimesheet}
          onSaveDraft={() => console.log('Draft saved')}
          isOpen={showSubmissionPanel}
          onClose={() => setShowSubmissionPanel(false)}
        />
      )}
    </div>
  );
};

export default Timesheet;
