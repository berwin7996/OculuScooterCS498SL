﻿using UnityEngine;
using System.Collections;
using System.IO.Ports;

public class SerialRead : MonoBehaviour {

	private static float angle;

	SerialPort sp = new SerialPort("COM3", 9600);

	// Use this for initialization
	void Start () 
	{
		sp.ReadTimeout = 10;
		sp.Open();
	}
	
	// Update is called once per frame
	void Update ()
	{
		if(sp.IsOpen)
		{
			try 
			{
				angle = float.Parse(sp.ReadLine());
//				print(angle);
			}
			catch(System.Exception)
			{
				sp.BaseStream.Flush();
			}
		}
	}

	public static float GetAngle() 
	{
		return angle;
	}
}