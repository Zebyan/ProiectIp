package com.example.aplicatieandroidip;

public class Pacient {
    String pacientName;
    String pacientID;
    int pacientImage;
    String pacientPhoneNo;
    String pacientPat;

    public Pacient(String pacientName, String pacientID, int pacientImage, String pacientPhoneNo, String pacientPat) {
        this.pacientName = pacientName;
        this.pacientID = pacientID;
        this.pacientImage = pacientImage;
        this.pacientPhoneNo = pacientPhoneNo;
        this.pacientPat = pacientPat;
    }


    public String getPacientName() {
        return pacientName;
    }

    public String getPacientID() {
        return pacientID;
    }

    public int getPacientImage() {
        return pacientImage;
    }

    public String getPacientPhoneNo() {
        return pacientPhoneNo;
    }

    public String getPacientPat() {
        return pacientPat;
    }
}
