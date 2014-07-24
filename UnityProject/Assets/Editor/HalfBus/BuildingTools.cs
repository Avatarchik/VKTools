using UnityEngine;
using UnityEditor;
using System.Diagnostics;
using System.IO;


public class BuildingTools : MonoBehaviour {
	
	[MenuItem( "HalfBus/Building Tools/Local testing build" )]
	public static void LocalTestingBuild() {
		// Set destination directory for Web build
		string path = Application.dataPath + "/../../Builds/Web";
		if ( !Directory.Exists( path ) ) { Directory.CreateDirectory( path ); }

		// Set levels to be included in build and make Web build
		string[] local_levels = new string[] { "Assets/Scenes/Loading.unity", "Assets/Scenes/Main.unity" };
		BuildPipeline.BuildPlayer( local_levels, path, BuildTarget.WebPlayer, BuildOptions.Development |
		                                                                      BuildOptions.AutoRunPlayer |
		                                                                      BuildOptions.WebPlayerOfflineDeployment );

		// Remove this stuff becouse Unity automaticly copied it to build directory
		// This is meta for each file in WebPlayerTemplates
		File.Delete( path + "/HalfBusLogo.png.meta" );
		File.Delete( path + "/HalfBusProgressBar.png.meta" );
		File.Delete( path + "/HalfBusProgressFrame.png.meta" );
		File.Delete( path + "/HalfBusVKStyle.css.meta" );
		File.Delete( path + "/HalfBusVKUtils.css.meta" );
		File.Delete( path + "/index.html.meta" );
		File.Delete( path + "/thumbnail.png.meta" );
		File.Delete( path + "/thumbnail.png" );
	}

}