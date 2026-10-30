@echo off
setlocal
set "MAVEN_PROJECTBASEDIR=%~dp0"
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"
set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
if not exist "%WRAPPER_JAR%" (
  echo Maven Wrapper JAR is missing: %WRAPPER_JAR%
  exit /b 1
)
if not defined JAVA_HOME (
  echo JAVA_HOME must point to a Java 21 JDK.
  exit /b 1
)
"%JAVA_HOME%\bin\java.exe" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
exit /b %ERRORLEVEL%
