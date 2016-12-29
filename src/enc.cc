#include <node.h>
#include <node_buffer.h>
#include <stdlib.h> 

#define BEG  0x12
#define	END  0x13
#define	DLE  0x7D

using namespace v8;

void EncodeObject(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);

  Local<Object> bufferObj    = args[0]->ToObject();
  unsigned long l = node::Buffer::Length(bufferObj);
  char* s = (char*)    node::Buffer::Data(bufferObj);
  uint16_t k=l+2;
  for(unsigned long i=0;i< l; i++) {
        char c = s[i];
        if ( c == BEG || c == END || c == DLE )
		k++;
   }
		
  char* b = (char*) malloc(k);   
  char *p =b;
 
  *(p++) =BEG;	
  for(unsigned long i=0;i< l; i++) {
        char c = s[i];
        if ( c == BEG || c == END || c == DLE )
         *(p++)= DLE; 	
        *(p++) = c;
    }
  *(p++) = END;	
  k = (p - b);

  Local<Object> buff =    node::Buffer::New(isolate,b,k).ToLocalChecked();
  args.GetReturnValue().Set(buff);
  
}

void Init(Handle<Object> exports, Handle<Object> module) {
  NODE_SET_METHOD(module, "exports", EncodeObject);
}

NODE_MODULE(addon, Init)
  

