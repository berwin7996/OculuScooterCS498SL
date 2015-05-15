
// These variables allow the script to power the wheels of the car.
var FrontLeftWheel : WheelCollider;
var FrontRightWheel : WheelCollider;
var steeringStrength : float = 80;

// These variables are for the gears, the array is the list of ratios. The script
// uses the defined gear ratios to determine how much torque to apply to the wheels.
var GearRatio : float[];
var CurrentGear : int = 0;

// These variables are just for applying torque to the wheels and shifting gears.
// using the defined Max and Min Engine RPM, the script can determine what gear the
// car needs to be in.
var EngineTorque : float = 200.0;
var MaxEngineRPM : float = 3000.0;
var MinEngineRPM : float = 1000.0;
var MinTorque : float = 400.0;
private var EngineRPM : float = 0.0;

var initialAngle : float;

var w : WWW;
var wIssuedAt : long = System.DateTime.Now.Ticks / 10000;

var throttleValue : int = 0;

var constant_vel : boolean = false;

function Start () {
	// I usually alter the center of mass to make the car more stable. I'ts less likely to flip this way.
	rigidbody.centerOfMass += Vector3(0, -1.0, .15);
	
	yield WaitForSeconds(1);

	initialAngle = SerialRead.GetAngle();
	
//	gameObject.Find("player_graphic").animation.wrapMode = WrapMode.Once;
}

function Update () {
	if (Input.GetKeyDown(KeyCode.C)) {
		print("reset is pressed");
		initialAngle = SerialRead.GetAngle();
	}
	
	if (Input.GetKeyDown(KeyCode.R)) {
		print("Respawn");
		gameObject.Find("Player").transform.position = Vector3(13.116, 1.0814, -33.184);
		gameObject.Find("Player").transform.rotation = Quaternion.Euler(0, 270, 0);
		throttleValue = 0;
	}
	
	// This is to limith the maximum speed of the car, adjusting the drag probably isn't the best way of doing it,
	// but it's easy, and it doesn't interfere with the physics processing.
	// rigidbody.drag = rigidbody.velocity.magnitude * 500000;

	var normalizedThrottleValue : float = throttleValue / 2000.0;
	
	var keyboardVerticalInput = Input.GetAxis("Vertical");
	if (keyboardVerticalInput != 0) {
		normalizedThrottleValue = keyboardVerticalInput / 2.0;
	}

	if (Input.GetKeyDown(KeyCode.Space)) {
		print("Enable constant velocity");
		constant_vel = !constant_vel;
	}

	if(constant_vel){
		normalizedThrottleValue = 50;
		MinTorque = 250;
	}
	else
		MinTorque = 400;

	FrontLeftWheel.motorTorque = Mathf.Min(MinTorque, EngineTorque * normalizedThrottleValue);
	FrontRightWheel.motorTorque = Mathf.Min(MinTorque, EngineTorque * normalizedThrottleValue);
	// print(FrontLeftWheel.motorTorque);
	
	// print(rigidbody.velocity.magnitude);
	FrontLeftWheel.brakeTorque = 10 + rigidbody.velocity.magnitude * 25;
	FrontRightWheel.brakeTorque = 10 + rigidbody.velocity.magnitude * 25;

	if (FrontLeftWheel.motorTorque == 0) {
		FrontLeftWheel.brakeTorque = 10;
		FrontRightWheel.brakeTorque = 10;
	}
	
	var keyboardHorizontalInput = Input.GetAxis("Horizontal");
	if (keyboardHorizontalInput != 0) {
		// the steer angle is an arbitrary value multiplied by the user input.
		FrontLeftWheel.steerAngle = steeringStrength * Input.GetAxis("Horizontal");
		FrontRightWheel.steerAngle = steeringStrength * Input.GetAxis("Horizontal");		
	} else {
		var offsetForReverse = SerialRead.getOffset();
		var theAngle = SerialRead.GetAngle() - initialAngle + offsetForReverse;
		// theAngle = theAngle * 1.8;

		// print(theAngle);
		
		FrontLeftWheel.steerAngle = theAngle;
		FrontRightWheel.steerAngle = theAngle;
	}
	

	if (w == null || System.DateTime.Now.Ticks / 10000 - wIssuedAt > 1000) {
//		print(normalizedThrottleValue + " " + rigidbody.velocity.magnitude);
//		gameObject.Find("debugtext").GetComponentInChildren(TextMesh).text = "Speed: " + rigidbody.velocity.magnitude.ToString("F1") + " Throttle: "+ (normalizedThrottleValue).ToString("F1")+ " Steering: "+(theAngle).ToString("F1");
		wIssuedAt = System.DateTime.Now.Ticks / 10000;
		requestThrottleValue();
	}
	
/*
	if (rigidbody.velocity.magnitude > 0.1) {
		gameObject.Find("player_graphic").animation.wrapMode = WrapMode.Loop;
		gameObject.Find("player_graphic").animation.Play();
	} else {
		gameObject.Find("player_graphic").animation.wrapMode = WrapMode.Once;
	}
*/
}


function requestThrottleValue() {
	var starttime = System.DateTime.Now.Ticks / 10000;

	var url = "https://api.spark.io/v1/devices/54ff70066672524829441867/rpm?access_token=3cd6b09bb31bf6e1bf3cc0b4d8272a88d2098cf2";
	// var form : WWWForm = new WWWForm();
	// form.AddField("args", "400");
	// form.AddField("access_token", "3cd6b09bb31bf6e1bf3cc0b4d8272a88d2098cf2");
	
	// w = WWW(url, form);
	w = WWW(url);
	yield w;
	if (!String.IsNullOrEmpty(w.error))
	{
		print(w.error);
	}
	else
	{
		var resultString = w.text;
		var parsed = SimpleJSON.JSON.Parse(resultString);
		
		throttleValue = parsed["result"].AsInt;
		// print(throttleValue);
	}
	var endtime = System.DateTime.Now.Ticks / 10000;
	// print(endtime-starttime);
}
