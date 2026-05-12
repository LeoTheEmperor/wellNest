import sys
import subprocess

def test_python_executable():
    """Test different Python executables to find Flask"""
    executables = ['python', 'py', 'python3']
    
    for exe in executables:
        try:
            result = subprocess.run([exe, '-c', 'import flask; print("FLASK_OK")'], 
                                  capture_output=True, text=True, timeout=5)
            if "FLASK_OK" in result.stdout:
                print(f"✅ Found working Python with Flask: {exe}")
                return exe
        except (subprocess.TimeoutExpired, subprocess.CalledProcessError, FileNotFoundError):
            continue
    
    print("❌ No working Python with Flask found")
    return None

if __name__ == "__main__":
    python_exe = test_python_executable()
    
    if python_exe:
        print(f"\n🚀 Starting backend with: {python_exe}")
        print("💡 Use this command to start your backend:")
        print(f"   {python_exe} app.py")
        
        # Try to start the actual app
        try:
            subprocess.run([python_exe, 'app.py'])
        except KeyboardInterrupt:
            print("\n⏹ Backend stopped by user")
        except Exception as e:
            print(f"❌ Error starting backend: {e}")
    else:
        print("\n⚠️  Please install Flask first:")
        print("   py -m pip install flask flask-cors google-generativeai")
