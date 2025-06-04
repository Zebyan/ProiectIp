package com.example.aplicatieandroidip;


import android.Manifest;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;


import androidx.annotation.RequiresPermission;

import java.util.ArrayList;

// Class which sets the device name and address in order in the ListView
public class DeviceListAdapter extends ArrayAdapter<BluetoothDevice> {
   private LayoutInflater mLayoutInflater;
   private ArrayList<BluetoothDevice> mDevices;
   private int mViewResourceId;

    public DeviceListAdapter(Context context, ArrayList<BluetoothDevice> mDevices, int mViewResourceId) {
        super(context, mViewResourceId, mDevices);
        this.mLayoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        this.mDevices = mDevices;
        this.mViewResourceId = mViewResourceId;
    }

    @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
    public View getView(int position, View convertView, ViewGroup parent)
    {
        convertView = mLayoutInflater.inflate(mViewResourceId, null);
        BluetoothDevice device = mDevices.get(position);

        if(device != null)
        {
            TextView deviceName = (TextView) convertView.findViewById(R.id.tvDeviceName);
            TextView deviceAddress = (TextView) convertView.findViewById(R.id.tvDeviceAddress);

            if(deviceName != null)
            {
                deviceName.setText(device.getName());
            }
            if(deviceAddress != null)
            {
                deviceAddress.setText(device.getAddress());
            }
        }
        return convertView;
    }
}
