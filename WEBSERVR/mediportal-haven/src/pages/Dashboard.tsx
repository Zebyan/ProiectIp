
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Activity } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Welcome to BioMedBot</h2>
        <p className="text-gray-600 mt-1">
          Semi-automated robotic medication transport system
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Tasks</CardTitle>
            <Clock className="h-4 w-4 text-medical-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              For the next 24 hours
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Real-time monitoring of robotic fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-500 mr-2" />
                  <span>Robot RS-001</span>
                </div>
                <span className="text-green-500 font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-500 mr-2" />
                  <span>Robot RS-002</span>
                </div>
                <span className="text-green-500 font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-yellow-500 mr-2" />
                  <span>Robot RS-003</span>
                </div>
                <span className="text-yellow-500 font-medium">Charging</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-500 mr-2" />
                  <span>Robot RS-004</span>
                </div>
                <span className="text-green-500 font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-red-500 mr-2" />
                  <span>Robot RS-005</span>
                </div>
                <span className="text-red-500 font-medium">Maintenance</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-medical-primary pl-4 py-1">
                <p className="text-sm font-medium">Delivery Completed</p>
                <p className="text-xs text-muted-foreground">Robot RS-001 completed delivery to Ward 4B</p>
                <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
              </div>
              
              <div className="border-l-4 border-medical-primary pl-4 py-1">
                <p className="text-sm font-medium">Delivery Started</p>
                <p className="text-xs text-muted-foreground">Robot RS-002 began delivery to Pharmacy</p>
                <p className="text-xs text-muted-foreground mt-1">24 minutes ago</p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4 py-1">
                <p className="text-sm font-medium">Battery Low</p>
                <p className="text-xs text-muted-foreground">Robot RS-003 returned to charging station</p>
                <p className="text-xs text-muted-foreground mt-1">42 minutes ago</p>
              </div>
              
              <div className="border-l-4 border-medical-primary pl-4 py-1">
                <p className="text-sm font-medium">Schedule Updated</p>
                <p className="text-xs text-muted-foreground">New delivery tasks added to queue</p>
                <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4 py-1">
                <p className="text-sm font-medium">Maintenance Alert</p>
                <p className="text-xs text-muted-foreground">Robot RS-005 scheduled for maintenance</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
