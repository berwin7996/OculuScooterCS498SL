using UnityEngine;
using System.Collections;

public class Audience_Animation : MonoBehaviour {

	private string[] names = {"idle","applause","applause2","celebration","celebration2","celebration3"};

// Use this for initialization
	void Start () {
		Animation[] AudienceMembers = gameObject.GetComponentsInChildren<Animation>();
		foreach(Animation anim in AudienceMembers){
		string thisAnimation = names[Random.Range(0,5)];

		anim.wrapMode = WrapMode.Loop;
		anim.animation.CrossFade(thisAnimation);
		anim[thisAnimation].time = Random.Range(0f,3f);
		}
	}
	// Update is called once per frame
	void Update () {
	
	}
}
