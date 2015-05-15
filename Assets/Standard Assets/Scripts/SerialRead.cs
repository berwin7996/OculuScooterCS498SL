using UnityEngine;
using System.Collections;
using System.IO.Ports;

public class SerialRead : MonoBehaviour {

	private static float angle;
	private static float offset;

	private static SerialPort sp = new SerialPort("COM4", 9600);
	char[] delimiterChars = { ' ', ',', '.', ':', '\t' };
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
				string temp = sp.ReadLine();
				string[] words = temp.Split(delimiterChars);
				//print(words);
				angle = float.Parse(words[0]);
				offset = float.Parse(words[1])*180;
				//angle = float.Parse(sp.ReadLine());
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

	public static float getOffset()
	{
		return offset;
	}

}