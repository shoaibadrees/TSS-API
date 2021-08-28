using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.IO;
using System;

namespace EPay.DataAccess
{
	public class Encryptor
	{
		private static TripleDESCryptoServiceProvider des = 
			new TripleDESCryptoServiceProvider();

		private static string myKey = "TemporarySecretKey";
		private static string myVector = "TemporaryVector";

		private static Byte[] Key
		{
			get 
			{
				return Encoding.Default.GetBytes(myKey.PadRight(24, Convert.ToChar(0)));
			}
		}
		private static Byte[] Vector
		{
			get 
			{
				return Encoding.Default.GetBytes(myVector.PadRight(8, Convert.ToChar(0)));
			}
		}
		public static string Encrypt(string text)
		{
			ICryptoTransform cryptoTransform = null;
			MemoryStream stream = new MemoryStream();
			
			cryptoTransform = des.CreateEncryptor(Key, Vector);
			
			CryptoStream cryptoStream = new CryptoStream
				(stream, cryptoTransform, CryptoStreamMode.Write);

			Byte[] Input = Encoding.Default.GetBytes(text);
			
			cryptoStream.Write(Input, 0, Input.Length);
			cryptoStream.FlushFinalBlock();

			return System.Convert.ToBase64String(stream.ToArray());			
		}
		public static string Decrypt(string encryptedText)
		{
			ICryptoTransform cryptoTransform = null;
			cryptoTransform = des.CreateDecryptor(Key, Vector);
			
			MemoryStream stream = new MemoryStream();

			CryptoStream cryptoStream = new  CryptoStream
				(stream, cryptoTransform, CryptoStreamMode.Write);

			Byte []Input = System.Convert.FromBase64String(encryptedText);

			cryptoStream.Write(Input, 0, Input.Length);
			cryptoStream.FlushFinalBlock();

			return Encoding.Default.GetString(stream.ToArray());
		}
	}
}
