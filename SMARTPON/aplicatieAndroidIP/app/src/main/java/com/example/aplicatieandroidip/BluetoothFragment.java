package com.example.aplicatieandroidip;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresPermission;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;


public class BluetoothFragment extends Fragment implements AdapterView.OnItemClickListener {

    private static final String TAG = "BluetoothActivity";
    BluetoothAdapter mBluetoothAdapter;
    public ArrayList<BluetoothDevice> mBTDevices;
    public DeviceListAdapter mDeviceListAdapter;
    ListView lvDeviceList;

    private final BroadcastReceiver mBroadcastReceiverToggleBT = new BroadcastReceiver() {
        @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (action.equals(mBluetoothAdapter.ACTION_STATE_CHANGED))
            {
                final int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, mBluetoothAdapter.ERROR);

                switch (state)
                {
                    case BluetoothAdapter.STATE_OFF:
                        Log.d(TAG, "onReceive: STATE OFF");
                        Toast.makeText(context, "Bluetooth is now OFF", Toast.LENGTH_SHORT).show();
                        break;
                    case BluetoothAdapter.STATE_TURNING_OFF:
                        Log.d(TAG, "onReceive: STATE TURNING OFF");
                        break;
                    case BluetoothAdapter.STATE_ON:
                        Log.d(TAG, "onReceive: STATE ON");
                        Toast.makeText(context, "Bluetooth is now ON", Toast.LENGTH_SHORT).show();
                        break;
                    case BluetoothAdapter.STATE_TURNING_ON:
                        Log.d(TAG, "onReceive: STATE TURNING ON");
                        break;
                }
            }
        }
    };

    private final BroadcastReceiver mBroadcastReceiverDiscoverBT = new BroadcastReceiver() {
        @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();
            Log.d(TAG, "onReceive: Action Found.");

            if(action.equals(BluetoothDevice.ACTION_FOUND))
            {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);

                if(device != null && !deviceExists(device) && device.getName() != null)
                {
                    mBTDevices.add(device);
                    Log.d(TAG, "onReceive: " + device.getName() + " " + device.getAddress());

                    // Preserve scroll position
                    int index = lvDeviceList.getFirstVisiblePosition();
                    View v = lvDeviceList.getChildAt(0);
                    int top = (v == null) ? 0 : v.getTop();

                    if (mDeviceListAdapter == null) {
                        mDeviceListAdapter = new DeviceListAdapter(context, mBTDevices, R.layout.device_adapter_view);
                        lvDeviceList.setAdapter(mDeviceListAdapter);
                    } else {
                        mDeviceListAdapter.notifyDataSetChanged();
                    }

                    lvDeviceList.setSelectionFromTop(index, top);
                }

            }
        }
    };

    private final BroadcastReceiver mBroadcastReceiverPairBT = new BroadcastReceiver() {
        @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();

            if(action.equals(BluetoothDevice.ACTION_BOND_STATE_CHANGED)) {
                Log.d(TAG, "Action Changed");
                BluetoothDevice mDevice = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                int bondState = intent.getIntExtra(BluetoothDevice.EXTRA_BOND_STATE, BluetoothDevice.ERROR);
                int prevBondState = intent.getIntExtra(BluetoothDevice.EXTRA_PREVIOUS_BOND_STATE, BluetoothDevice.ERROR);

                switch (mDevice.getBondState()) {
                    case BluetoothDevice.BOND_BONDED:
                        Log.d(TAG, "onReceive: BOND_BONDED");
                        break;
                    case BluetoothDevice.BOND_BONDING:
                        Log.d(TAG, "onReceive: BOND_BONDING");
                        break;
                    case BluetoothDevice.BOND_NONE:
                        Log.d(TAG, "onReceive: BOND_NONE");
                        break;
                }

                if (bondState == BluetoothDevice.BOND_BONDED && prevBondState == BluetoothDevice.BOND_BONDING) {
                    launchManualControl(mDevice); //  Pairing complete — NOW launch ManualControlActivity
                }
            }
        }
    };

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_bluetooth, container, false);
    }

    @RequiresPermission(allOf = {Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT})
    public void onViewCreated(View view, Bundle savedInstanceState){
        super.onViewCreated(view, savedInstanceState);

        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();       // Checks if device is capable of BT (usually is)
        if(mBluetoothAdapter == null){
            Toast.makeText(getContext(), "Bluetooth not supported on this device.", Toast.LENGTH_SHORT).show();
            return;
        }
        lvDeviceList = view.findViewById(R.id.lvDeviceList_frag);
        mBTDevices = new ArrayList<>();

        IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_BOND_STATE_CHANGED);      //This is broadcast only when there is an attempt at bonding
        try {
            requireContext().registerReceiver(mBroadcastReceiverPairBT, filter);
        } catch (Exception e) {
            Log.e(TAG, "Receiver registration PairBT", e);
        }
        lvDeviceList.setOnItemClickListener(BluetoothFragment.this);        //Makes it so that an item can be selected

        Button btnToggleBT = view.findViewById(R.id.btnToggleBT_frag);
        btnToggleBT.setOnClickListener(v -> toggleBTFrag());

        Button btnRefreshDevices = view.findViewById(R.id.btnRefreshDevices_frag);
        btnRefreshDevices.setOnClickListener(v -> refreshDevicesFrag(v, btnRefreshDevices));



        if(mBluetoothAdapter != null && mBluetoothAdapter.isEnabled())
        {
            discoverBTFrag(null, btnRefreshDevices);
        }
    }

    @Override
    @RequiresPermission(Manifest.permission.BLUETOOTH_SCAN)
    public void onDestroyView(){
        super.onDestroyView();

        if(mBluetoothAdapter != null && mBluetoothAdapter.isDiscovering()){
            mBluetoothAdapter.cancelDiscovery();
        }

        try {
            requireActivity().unregisterReceiver(mBroadcastReceiverPairBT);
            requireActivity().unregisterReceiver(mBroadcastReceiverToggleBT);
            requireActivity().unregisterReceiver(mBroadcastReceiverDiscoverBT);
        } catch (IllegalArgumentException e) {
            Log.e(TAG, "Receiver not registered");
        }
    }

    @RequiresPermission(Manifest.permission.BLUETOOTH_SCAN)
    public void discoverBTFrag(View v, Button btnRefreshDevices)
    {
        if(mBluetoothAdapter.isEnabled()) {
            Log.d(TAG, "discoverBT: Looking for unpaired devices.");
            btnRefreshDevices.setVisibility(View.VISIBLE);
            btnRefreshDevices.setEnabled(false);

            if (mBluetoothAdapter.isDiscovering()) {
                mBluetoothAdapter.cancelDiscovery();
                Log.d(TAG, "discoverBT: Canceling discovery.");
            }

            checkBTPermissions();

            mBluetoothAdapter.startDiscovery();
            IntentFilter discoverDevicesIntent = new IntentFilter(BluetoothDevice.ACTION_FOUND);
            try {
                requireContext().registerReceiver(mBroadcastReceiverDiscoverBT, discoverDevicesIntent);
            } catch (Exception e) {
                Log.e(TAG, "Register Discover Fail", e);
            }
            new android.os.Handler().postDelayed(() -> {
                if (mBluetoothAdapter.isDiscovering()) {
                    mBluetoothAdapter.cancelDiscovery();
                    Log.d(TAG, "discoverBT: Stopping discovery after 30 seconds.");
                }
                btnRefreshDevices.setEnabled(true);  // Re-enable button after stopping discovery
            }, 30000);
        }
        else{
            Log.d(TAG, "toggleDiscoverability: BLUETOOTH IS NOT ENABLED!");
            Toast.makeText(getContext(), "Please Enable Bluetooth", Toast.LENGTH_SHORT).show();
            btnRefreshDevices.setVisibility(View.VISIBLE);
            btnRefreshDevices.setEnabled(false);
        }
    }

    private void checkBTPermissions()               //Android 6.0+ needs to check some permissions in order to be able to discover other devices
    {
        int permissionCheck = getContext().checkSelfPermission("Manifest.permission.ACCESS_FINE_LOCATION");
        permissionCheck += getContext().checkSelfPermission("Manifest.permission.ACCESS_COURSE_LOCATION");
        if(permissionCheck != 0)
        {
            this.requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, 1001);
        }
    }

    private boolean deviceExists(BluetoothDevice device)            //Function for checking if the device is already in the ListView
    {
        for(BluetoothDevice BTDevice : mBTDevices)
        {
            if(BTDevice.getAddress().equals(device.getAddress())){
                return true;
            }
        }
        return false;
    }

    private void launchManualControl(BluetoothDevice device)
    {
        Intent intent = new Intent(this.getContext(), ManualControlActivity.class);
        intent.putExtra("device", device.getAddress());
        String status = getArguments() != null ? getArguments().getString("status") : "";
        intent.putExtra("status", status);
        startActivity(intent);
    }

    @RequiresPermission(allOf = {Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT})
    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        mBluetoothAdapter.cancelDiscovery();        //This eats a lot of memory if not cancelled
        Log.d(TAG, "onItemClick: Chose a device");
        BluetoothDevice selectedDevice = mBTDevices.get(position);
        String deviceName = selectedDevice.getName();
        String deviceAddress = selectedDevice.getAddress();

        Log.d(TAG, "onItemClick: deviceName: " + deviceName);
        Log.d(TAG, "onItemClick: deviceAddress: " + deviceAddress);

        if(selectedDevice.getBondState() == BluetoothDevice.BOND_BONDED)
        {
            Log.d(TAG, "Device already paired, starting connection");
            launchManualControl(selectedDevice);
        }
        else {
            Log.d(TAG, "Trying to pair with " + deviceName);
            selectedDevice.createBond();
            Toast.makeText(getContext(), "Pairing with " + selectedDevice.getName(), Toast.LENGTH_SHORT).show();
        }
    }

    @RequiresPermission(Manifest.permission.BLUETOOTH_SCAN)
    public void refreshDevicesFrag(View view, Button btnRefreshDevices) {
        Log.d(TAG, "refreshDevices: Refreshing available devices...");

        mBTDevices.clear();
        if(mDeviceListAdapter != null)
        {
            mDeviceListAdapter.notifyDataSetChanged();
        }

        discoverBTFrag(view, btnRefreshDevices);
    }


    @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
    public void toggleBTFrag() {
        if(mBluetoothAdapter == null)
        {
            Log.d(TAG, "toggleBTFrag: Device not capable of Bluetooth");
        }
        if(!mBluetoothAdapter.isEnabled())
        {
            Log.d(TAG, "toggleBTFrag: Enabling BT");
            Intent enableBTIntent = new Intent((BluetoothAdapter.ACTION_REQUEST_ENABLE));
            startActivity(enableBTIntent);

            IntentFilter BTIntent = new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED);
            try {
                requireContext().registerReceiver(mBroadcastReceiverToggleBT, BTIntent);        //Tells the receiver the state of the device
            } catch (Exception e) {
                Log.e(TAG, "Register ToggleBT Fail", e);
            }
        }
        if(mBluetoothAdapter.isEnabled())
        {
            Log.d(TAG, "toggleBTFrag: Disabling BT");
            mBluetoothAdapter.disable();

            IntentFilter BTIntent = new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED);
            try {
                requireContext().registerReceiver(mBroadcastReceiverToggleBT, BTIntent);
            } catch (Exception e) {
                Log.e(TAG, "Register ToggleBT Fail", e);
            }
        }
    }
}